import { createBlank, getBlanksByMethodId, updateMethodBlankList } from "./blanks";
import { pb } from "./pocketbase";
import type { BlanksResponse, DetectionLimitsResponse, ElementsResponse, MethodsResponse, UnitsResponse } from "./pocketbase-types";
import { method } from "./stores";

export type Analyte = {
    id: string
    mass: number
    name: string
    symbol: string
    units: string;
    unitsId: string;
}

export class Method {
    active?: boolean
    calibrationCount?: number
    checkStandardName?: string
    checkStandardTolerance?: number
    description?: string
    name?: string;
    rpdLimit?: number
    slug?: string
    elements?: Analyte[]
    blanks?: Map<string, BlanksResponse>

    constructor(
        public id: string | undefined
    ) { }

    private setPropertiesFromMethodsResponse(methodsResponse: MethodsResponse) {
        for (const [key, value] of Object.entries(methodsResponse)) {
            if (Object.hasOwn(this, key)) {
                Object.defineProperty(this, key, { value, writable: true })
            }
        }
    }

    /* current param options are blanks, elements and referenceMaterials */
    async init(options: Record<string, boolean>) {
        console.log('initiating method', this.id);
        if (!this.id) throw new Error('Method has no id');

        // determine which collections to expand from the database
        const expandList: string[] = [];
        for (const [key, value] of Object.entries(options)) {
            this.elements?.map(element => element.id) ?? [];
            if (value) expandList.push(key);
            if (value && key === 'elements') expandList.push('units')
            if (value && key === 'blanks') expandList.push('blanks.detectionLimits')
        }
        let expandString = '';
        if (expandList.length > 0) {
            expandString = expandList.join(',');
        }

        const methodsResponse: MethodsResponse = await pb.collection('methods').getOne(this.id, { expand: expandString });
        if (!methodsResponse) throw new Error('Method not found in database');
        this.setPropertiesFromMethodsResponse(methodsResponse);

        if (options.elements) this.populateElements(methodsResponse.expand?.elements, methodsResponse.expand?.units);
        if (options.blanks) this.populateBlankMap(methodsResponse.expand?.blanks);
        if (options.referenceMaterials) this.populateReferenceMaterialMap();

    }

    async updateProperties(props: Record<string, string | number | undefined>) {
        const updateData = JSON.stringify(props);
        if (!this.id) throw new Error('Method not in database')
        const updatedMethod: MethodsResponse = await pb.collection('methods').update(this.id, updateData);
        if (!updatedMethod) throw new Error('Error updating database')
        this.setPropertiesFromMethodsResponse(updatedMethod);
    }

    private populateElements(elements: ElementsResponse[], unitList: UnitsResponse[]) {
        console.log('populating elementMap!'); // TODO
        if (!elements || elements.length === 0) return [];

        const activeElements = elements.filter(element => element.active)
        this.elements = activeElements.map(element => {
            const elementUnits = unitList?.find(unitItem => unitItem.element === element.id);
            if (!elementUnits) throw new Error('No element units found')
            return {
                id: element.id,
                name: element.name,
                mass: element.mass,
                symbol: element.symbol,
                units: elementUnits.units,
                unitsId: elementUnits.id
            }
        });

    }

    private populateBlankMap(blanks: BlanksResponse[]) {
        console.log('populating blankMap');

        if (!blanks) {
            this.blanks = new Map();
            return;
        };

        const blankMap: Map<string, BlanksResponse> = new Map();
        for (let blank of blanks) {
            if (!blankMap.has(blank.name)) {
                blankMap.set(blank.name, blank)
            }
        }
        this.blanks = blankMap;


    }

    private populateReferenceMaterialMap() {
        console.log('populating referenceMaterialMap'); // TODO

    }
    async addElement(elementId: string) {
        if (!this.id) throw new Error('Method not in database');

        const unitsData = JSON.stringify({ element: elementId, units: 'ppm' })
        const newUnits: UnitsResponse = await pb.collection('units').create(unitsData);

        const unitsList = [...this.unitsIdList(), newUnits.id];
        let elementList = [...this.elementIdList(), elementId];

        const elementsData = JSON.stringify({ elements: elementList, units: unitsList })
        const updatedMethod: MethodsResponse = await pb.collection('methods').update(this.id, elementsData);

        if (!updatedMethod || !newUnits) throw new Error('Error adding element');

        const addedElement: ElementsResponse = await pb.collection('elements').getOne(elementId);
        const addedAnalyte = this.convertElementToAnalyte(addedElement, newUnits);
        if (!addedElement) throw new Error('Error retrieving element from database');

        await this.addDetectionLimitsToBlanks(elementId);

        this.elements = this.elements && this.elements.length > 0 ? [...this.elements, addedAnalyte] : [addedAnalyte]
    }

    async removeElement(element: Analyte) {
        if (!element.id || !this.id) throw new Error('Element or method not in database')

        const deletedUnits = await pb.collection('units').delete(element.unitsId);
        if (!deletedUnits === null) throw new Error('Error deleting units');

        const methodElements = this.elementIdList()?.filter(e => e != element.id)
        const methodUpdateData = JSON.stringify({
            elements: methodElements,
        })
        const updatedMethod = await pb.collection('methods').update(this.id, methodUpdateData);
        if (!updatedMethod) throw new Error('error updating database method');
        this.elements = this.elements?.filter(e => e.id != element.id);

        await this.removeDetectionLimitsFromBlanks(element.id);

    }

    convertElementToAnalyte = (element: ElementsResponse, units: UnitsResponse): Analyte => {
        return {
            id: element.id,
            mass: element.mass,
            symbol: element.symbol,
            name: element.name,
            units: units.units,
            unitsId: units.id
        }
    }

    async updateElementUnits(unitsId: string, newUnits: string) {
        const data = JSON.stringify({ units: newUnits })
        const updatedUnits: UnitsResponse = await pb.collection('units').update(unitsId, data);
        return updatedUnits;
    }

    async createNewBlank(name: string) {
        console.log('creating new blank', name);
        if (!this.id) throw new Error('Method not in database')

        // create blank in blanks collection
        const data = JSON.stringify({
            name
        })
        const newBlank: BlanksResponse = await pb.collection('blanks').create(data);

        // update method blanks to add new blank
        if (!this.blanks || this.blanks.size === 0) {
            const blanksMap = new Map();
            blanksMap.set(newBlank.name, newBlank)
            this.blanks = blanksMap;
        } else this.blanks.set(newBlank.name, newBlank);
        const blanksData = JSON.stringify({
            blanks: this.blanksIdList()
        })

        const updatedMethod: MethodsResponse = await pb.collection('methods').update(this.id, blanksData);
        if (!updatedMethod) throw new Error('Error updating method blanks')

        // create dl for each element in dl collection
        // create array of new dl ids
        let detectionLimitsIds: string[] = new Array();
        for (const currentElement of this.elements ?? []) {

            const dlData = JSON.stringify({
                element: currentElement.id
            })
            const newDetectionLimits: DetectionLimitsResponse = await pb.collection('detectionLimits').create(dlData);
            if (!newDetectionLimits) throw new Error('Error adding detection limits');
            detectionLimitsIds = [...detectionLimitsIds, newDetectionLimits.id];
        }

        const updatedNewBlank: BlanksResponse = await pb.collection('blanks').update(newBlank.id, { "detectionLimits": detectionLimitsIds })
        if (!updatedNewBlank) throw new Error('Error updating detection limit ids');
        this.blanks.set(updatedNewBlank.name, updatedNewBlank)
        return updatedNewBlank;
    }

    async addDetectionLimitsToBlanks(elementId: string) {
        // retrieve list of blanks
        const blanks = this.blanks;
        if (!blanks || blanks.size === 0) return;
        // for each blank
        for (const blank of blanks.values()) {
            //    add detection limit row and save id
            const dlData = JSON.stringify({ element: elementId })
            const newDl: DetectionLimitsResponse = await pb.collection('detectionLimits').create(dlData);
            if (!newDl) throw new Error('Error saving detection limit');
            //    update list of detection limits
            const updatedDls = JSON.stringify({ detectionLimits: [...blank.detectionLimits ?? [], newDl.id] })
            const updatedBlank: BlanksResponse = await pb.collection('blanks').update(blank.id, updatedDls);
            this.blanks?.set(updatedBlank.name, updatedBlank)
        }
    }

    async removeDetectionLimitsFromBlanks(elementId: string) {
        console.log('removing');
        // retrieve list of blanks
        const blanks = this.blanks;
        if (!blanks || blanks.size === 0) return;
        // for each blank
        for (const blank of blanks.values()) {
            const detectionLimits: DetectionLimitsResponse[] = blank.expand?.detectionLimits ?? []
            //    find the detection limits of interest
            const detectionLimit = detectionLimits.find(dl => dl.element === elementId);
            if (!detectionLimit) continue;
            //    remove detection limit row
            const deletedDetectionLimit = await pb.collection('detectionLimits').delete(detectionLimit.id);
            if (!deletedDetectionLimit) console.error('Error removing detection limit')
        }
    }

    async deleteBlank(blankName: string) {
        console.log(`deleting ${blankName}`);

        if (!this.blanks?.has(blankName)) throw new Error('Error: could not find blank');

        const blank = this.blanks.get(blankName);
        console.log(blank);

        const detectionLimits = blank?.detectionLimits;

        if (!blank) throw new Error('Could not find blank');

        const deletedBlank = await pb.collection('blanks').delete(blank.id);

        if (!deletedBlank) console.error(`Error deleting blank ${blank.name}`)
        if (detectionLimits) {
            for (const detectionLimit of detectionLimits) {
                console.log(detectionLimit);

                const deletedDl = await pb.collection('detectionLimits').delete(detectionLimit);
                if (!deletedDl) console.error(`error deleting detection limit with id ${detectionLimit}`);
            };
        }

        this.blanks?.delete(blankName)
    }

    elementIdList() {
        return this.elements?.map(element => element.id) ?? [];
    }

    unitsIdList() {
        return this.elements?.map(element => element.unitsId) ?? [];
    }
    blanksIdList() {
        const idList: string[] = []
        for (let blankRecord of this.blanks?.values() ?? []) {
            idList.push(blankRecord.id)
        }
        return idList
    }


}

export class Blank {


    constructor(
        public id: string | undefined,
        public methodId: string,
    ) { }

    async createNew(name: string) {
        const methodBlanks = await getBlanksByMethodId(this.methodId)
        const existingBlank = methodBlanks.find(blank => blank.name === name);
        if (existingBlank) throw new Error('Blank already exists');

        const newBlank = await createBlank(name);
        if (!newBlank) throw new Error('Error creating blank');

        this.id = newBlank.id;

        methodBlanks.push(newBlank);
        const methodBlankList: string[] = methodBlanks.map(blank => blank.id);
        const updatedMethod = await updateMethodBlankList(this.methodId, methodBlankList);

        if (!updatedMethod) throw new Error('Error updating method');
    }

    async getMethodElements() {
        // const 
        console.log('hi');

    }

}