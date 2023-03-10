import slugify from "slugify";
import { pb } from "./pocketbase";
import type { BlanksResponse, CheckStandardsResponse, CheckValuesResponse, DetectionLimitsResponse, ElementsResponse, MethodsResponse, ReferenceMaterialsRangesResponse, ReferenceMaterialsResponse, UnitsResponse } from "./pocketbase-types";

export type SampleType = "blanks" | "checkStandards" | "referenceMaterials";

export type ExpandType = "checkValues" | "detectionLimits" | "ranges"

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
    checkStandardTolerance?: number
    description?: string
    name?: string;
    rpdLimit?: number
    slug?: string
    elements?: Analyte[]
    blanks?: Map<string, BlanksResponse>
    checkStandards?: Map<string, CheckStandardsResponse>
    referenceMaterials?: Map<string, ReferenceMaterialsResponse>

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
            if (value && key === 'elements') expandList.push('units');
            if (value && key === 'blanks') expandList.push('blanks.detectionLimits');
            if (value && key === 'checkStandards') expandList.push('checkStandards.checkValues');
            if (value && key === 'referenceMaterials') expandList.push('referenceMaterials.ranges');
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
        if (options.checkStandards) this.populateCheckStandardsMap(methodsResponse.expand?.checkStandards);
        if (options.referenceMaterials) this.populateReferenceMaterialMap(methodsResponse.expand?.referenceMaterials);

    }

    async updateProperties(props: Record<string, string | number | undefined>) {
        if (props.name != undefined) props['slug'] = slugify(props.name.toString(), { lower: true })
        const updateData = JSON.stringify(props);
        if (!this.id) throw new Error('Method not in database')
        const updatedMethod: MethodsResponse = await pb.collection('methods').update(this.id, updateData);
        if (!updatedMethod) throw new Error('Error updating database')
    }

    private populateElements(elements: ElementsResponse[], unitList: UnitsResponse[]) {
        console.log('populating elementMap!');
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
        for (const blank of blanks) {
            if (!blankMap.has(blank.name)) {
                blankMap.set(blank.name, blank)
            }
        }
        this.blanks = blankMap;
    }


    private populateCheckStandardsMap(checkStandards: CheckStandardsResponse[]) {
        console.log('populating checkStdsMap');

        if (!checkStandards) {
            this.checkStandards = new Map();
            return;
        };

        const checkStdMap: Map<string, CheckStandardsResponse> = new Map();
        for (const checkStd of checkStandards) {
            if (!checkStdMap.has(checkStd.name)) {
                checkStdMap.set(checkStd.name, checkStd)
            }
        }
        this.checkStandards = checkStdMap;

    }


    private populateReferenceMaterialMap(referenceMaterials: ReferenceMaterialsResponse[]) {
        console.log('populating referenceMaterialMap');

        if (!referenceMaterials) {
            this.referenceMaterials = new Map();
            return;
        };

        const referenceMaterialsMap: Map<string, CheckStandardsResponse> = new Map();
        for (const rm of referenceMaterials) {
            if (!referenceMaterialsMap.has(rm.name)) {
                referenceMaterialsMap.set(rm.name, rm)
            }
        }
        this.referenceMaterials = referenceMaterialsMap;

    }


    async addElement(elementId: string) {
        if (!this.id) throw new Error('Method not in database');

        const unitsData = JSON.stringify({ element: elementId, units: 'ppm' })
        const newUnits: UnitsResponse = await pb.collection('units').create(unitsData);

        const unitsList = [...this.unitsIdList(), newUnits.id];
        const elementList = [...this.elementIdList(), elementId];

        const elementsData = JSON.stringify({ elements: elementList, units: unitsList })
        const updatedMethod: MethodsResponse = await pb.collection('methods').update(this.id, elementsData);

        if (!updatedMethod || !newUnits) throw new Error('Error adding element');

        const addedElement: ElementsResponse = await pb.collection('elements').getOne(elementId);
        const addedAnalyte = this.convertElementToAnalyte(addedElement, newUnits);
        if (!addedElement) throw new Error('Error retrieving element from database');

        await this.addDetectionLimitsToBlanks(elementId);
        await this.addValuesToCheckStandards(elementId);
        await this.addRangestoReferenceMaterials(elementId);

        this.elements = this.elements && this.elements.length > 0 ? [...this.elements, addedAnalyte] : [addedAnalyte]
    }

    async removeElement(element: Analyte) {
        if (!element.id || !this.id) throw new Error('Element or method not in database')

        const deletedUnits = await pb.collection('units').delete(element.unitsId);
        if (!deletedUnits) throw new Error('Error deleting units');

        const methodElements = this.elementIdList()?.filter(e => e != element.id)
        const methodUpdateData = JSON.stringify({
            elements: methodElements,
        })
        const updatedMethod = await pb.collection('methods').update(this.id, methodUpdateData);
        if (!updatedMethod) throw new Error('error updating database method');
        this.elements = this.elements?.filter(e => e.id != element.id);

        await this.removeDetectionLimitsFromBlanks(element.id);
        await this.removeValuesFromCheckStandards(element.id);
        await this.removeRangesFromReferenceMaterials(element.id);


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
        });

        const updatedMethod: MethodsResponse = await pb.collection('methods').update(this.id, blanksData);
        if (!updatedMethod) throw new Error('Error updating method blanks')

        // create dl for each element in dl collection
        // create array of new dl ids
        let detectionLimitsIds: string[] = [];
        for (const currentElement of this.elements ?? []) {

            const dlData = JSON.stringify({
                element: currentElement.id
            })
            const newDetectionLimits: DetectionLimitsResponse = await pb.collection('detectionLimits').create(dlData);
            if (!newDetectionLimits) throw new Error('Error adding detection limits');
            detectionLimitsIds = [...detectionLimitsIds, newDetectionLimits.id];
        }

        const updatedNewBlank: BlanksResponse = await pb.collection('blanks').update(newBlank.id, { "detectionLimits": detectionLimitsIds }, { expand: 'detectionLimits' })
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
            const dlIdList = blank.detectionLimits && blank.detectionLimits.length > 0 ? [...blank.detectionLimits, newDl.id] : [newDl.id];

            const updatedDls = JSON.stringify({ detectionLimits: dlIdList });

            const updatedBlank: BlanksResponse = await pb.collection('blanks').update(blank.id, updatedDls, { expand: 'detectionLimits' });
            this.blanks?.set(updatedBlank.name, updatedBlank)
        }
    }

    async addRangestoReferenceMaterials(elementId: string) {
        // retrieve list of reference materials
        const referenceMaterials = this.referenceMaterials;
        if (!referenceMaterials || referenceMaterials.size === 0) return;
        // for each check standard
        for (const referenceMaterial of referenceMaterials.values()) {
            //    add detection limit row and save id
            const rangeData = JSON.stringify({ element: elementId })
            const newRange: ReferenceMaterialsRangesResponse = await pb.collection('referenceMaterialsRanges').create(rangeData);
            if (!newRange) throw new Error('Error saving range');
            //    update list of detection limits
            const rangesIdList = referenceMaterial.ranges && referenceMaterial.ranges.length > 0 ? [...referenceMaterial.ranges, newRange.id] : [newRange.id];
            const updatedRanges = JSON.stringify({ ranges: rangesIdList })

            const updatedReferenceMaterial: ReferenceMaterialsResponse = await pb.collection('referenceMaterials').update(referenceMaterial.id, updatedRanges, { expand: 'ranges' });

            this.referenceMaterials?.set(updatedReferenceMaterial.name, updatedReferenceMaterial)
        }
    }

    async addValuesToCheckStandards(elementId: string) {
        // retrieve list of check standards
        const checkStandards = this.checkStandards;
        if (!checkStandards || checkStandards.size === 0) return;
        // for each check standard
        for (const checkStandard of checkStandards.values()) {
            //    add detection limit row and save id
            const checkValue = JSON.stringify({ element: elementId })
            const newValue: CheckValuesResponse = await pb.collection('checkValues').create(checkValue);
            if (!newValue) throw new Error('Error saving check value');
            //    update list of detection limits
            const valuesIdList = checkStandard.checkValues && checkStandard.checkValues.length > 0 ? [...checkStandard.checkValues, newValue.id] : [newValue.id];
            const updateCheckValues = JSON.stringify({ checkValues: valuesIdList })

            const updatedCheckStandard: CheckStandardsResponse = await pb.collection('checkStandards').update(checkStandard.id, updateCheckValues, { expand: 'checkValues' });

            this.checkStandards?.set(updatedCheckStandard.name, updatedCheckStandard)
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
            if (!detectionLimit) throw new Error('Detection Limit is missing!');
            //    remove detection limit row
            const deletedDetectionLimit = await pb.collection('detectionLimits').delete(detectionLimit.id);
            if (!deletedDetectionLimit) console.error('Error removing detection limit');
            blank.detectionLimits = blank.detectionLimits?.filter(dl => dl != detectionLimit.id);
            this.blanks?.set(blank.name, blank);

        }
    }

    async removeRangesFromReferenceMaterials(elementId: string) {
        // retrieve list of reference materials
        const referenceMaterials = this.referenceMaterials;
        if (!referenceMaterials || referenceMaterials.size === 0) return;

        for (const referenceMaterial of referenceMaterials.values()) {
            const ranges: ReferenceMaterialsRangesResponse[] = referenceMaterial.expand?.ranges ?? []
            //    find the values of interest
            const range = ranges.find(range => range.element === elementId);
            if (!range) throw new Error('Range entry is missing!');
            //    remove value row
            const deletedRange = await pb.collection('referenceMaterialsRanges').delete(range.id);
            if (!deletedRange) console.error('Error removing range');
            referenceMaterial.ranges = referenceMaterial.ranges?.filter(r => r != range.id)
            this.referenceMaterials?.set(referenceMaterial.name, referenceMaterial);
        }
    }
    async removeValuesFromCheckStandards(elementId: string) {
        // retrieve list of checkStandards
        const checkStandards = this.checkStandards;
        if (!checkStandards || checkStandards.size === 0) return;
        // for each check
        for (const checkStandard of checkStandards.values()) {
            const checkValues: CheckValuesResponse[] = checkStandard.expand?.checkValues ?? []
            //    find the values of interest
            const checkValue = checkValues.find(value => value.element === elementId);
            if (!checkValue) throw new Error('Value entry is missing!');
            //    remove value row
            const deletedCheckValue = await pb.collection('checkValues').delete(checkValue.id);
            if (!deletedCheckValue) console.error('Error removing check value');
            checkStandard.checkValues = checkStandard.checkValues?.filter(cv => cv != checkValue.id)
            this.checkStandards?.set(checkStandard.name, checkStandard);
        }
    }

    async deleteBlank(blankName: string) {
        console.log(`deleting ${blankName}`);

        if (!this.blanks?.has(blankName)) throw new Error('Error: could not find blank');
        const blank = this.blanks.get(blankName);
        const detectionLimits = blank?.detectionLimits;
        if (!blank) throw new Error('Could not find blank');
        const deletedBlank = await pb.collection('blanks').delete(blank.id);
        if (!deletedBlank) console.error(`Error deleting blank ${blank.name}`)
        if (detectionLimits) {
            for (const detectionLimit of detectionLimits) {
                const deletedDl = await pb.collection('detectionLimits').delete(detectionLimit);
                if (!deletedDl) console.error(`error deleting detection limit with id ${detectionLimit}`);
            };
        }
        this.blanks?.delete(blankName)
    }

    async deleteReferenceMaterial(referenceMaterialName: string) {
        console.log(`deleting ${referenceMaterialName}`);

        if (!this.referenceMaterials?.has(referenceMaterialName)) throw new Error('Could not find reference material');

        const referenceMaterial = this.referenceMaterials.get(referenceMaterialName);
        if (!referenceMaterial) throw new Error('Could not find reference material');

        for (const valueId of referenceMaterial?.ranges ?? []) {
            const deletedValue: boolean = await pb.collection('referenceMaterialsRanges').delete(valueId);
            if (!deletedValue) throw new Error('Error deleting range')
        }

        const deletedReferenceMaterial = await pb.collection('referenceMaterials').delete(referenceMaterial.id);
        if (!deletedReferenceMaterial) throw new Error('y u no delete reference material?')
        this.referenceMaterials?.delete(referenceMaterialName)
    }

    async deleteCheckStandard(checkStandardName: string) {
        console.log(`deleting ${checkStandardName}`);

        if (!this.checkStandards?.has(checkStandardName)) throw new Error('Error: could not find blank');

        const checkStandard = this.checkStandards.get(checkStandardName);
        if (!checkStandard) throw new Error('Could not find blank');

        for (const valueId of checkStandard?.checkValues ?? []) {
            const deletedValue: boolean = await pb.collection('checkValues').delete(valueId);
            if (!deletedValue) throw new Error('Error deleting checkValue')
        }

        const deletedCheckStandard = await pb.collection('checkStandards').delete(checkStandard.id);
        if (!deletedCheckStandard) throw new Error('y u no delete check standard?')
        this.checkStandards?.delete(checkStandardName)
    }


    async updateReferenceRanges(rangeId: string, toUpdate: "lower" | "upper", value: number) {
        if (!rangeId) throw new Error('Error finding range in database');
        const dataObject: Record<string, number> = {};
        dataObject[toUpdate] = value;
        const updatedRange: ReferenceMaterialsRangesResponse = await pb.collection('referenceMaterialsRanges').update(rangeId, JSON.stringify(dataObject));
        if (!updatedRange) throw new Error('Error updating ranges');
    }

    async updateDetectionLimits(detectionLimitsId: string, toUpdate: "mdl" | "loq", value: number) {
        if (!detectionLimitsId) throw new Error('Error finding detection limit in database');
        const dataObject: Record<string, number> = {};
        dataObject[toUpdate] = value;
        const updatedDetectionLimit: DetectionLimitsResponse = await pb.collection('detectionLimits').update(detectionLimitsId, JSON.stringify(dataObject));
        if (!updatedDetectionLimit) throw new Error('Error updated detection limits');
    }

    async updateCheckStandardValue(checkValueId: string, value: number) {
        if (!checkValueId) throw new Error('Error finding check value in database');
        const data = JSON.stringify({
            value
        })
        const updatedDetectionLimit: DetectionLimitsResponse = await pb.collection('checkValues').update(checkValueId, data);
        if (!updatedDetectionLimit) throw new Error('Error updated detection limits');
    }

    getCheckStandardNameFromId(id: string) {
        const stds = this.checkStandards;
        for (const std of stds?.values() ?? []) {
            if (std.id === id) return std.name;
        }
    }

    async updateCheckStandardName(checkStandardId: string, newName: string) {
        if (!this.checkStandards || this.checkStandards.size === 0) throw new Error('No check standard in method object')
        const data = JSON.stringify({ name: newName });
        const oldCheckStandard = this.getCheckStandardNameFromId(checkStandardId);
        const updatedCheckStandard: CheckStandardsResponse = await pb
            .collection('checkStandards')
            .update(checkStandardId, data);
        if (!updatedCheckStandard) throw new Error('Error updating name');

        this.checkStandards.delete(oldCheckStandard ?? '');
        this.checkStandards.set(updatedCheckStandard.name, updatedCheckStandard);
    }

    getReferenceMaterialNameFromId(id: string) {
        const blanks = this.blanks;
        for (const blank of blanks?.values() ?? []) {
            if (blank.id === id) return blank.name;
        }
    }

    async updateReferenceMaterialName(referenceMaterialId: string, newName: string) {
        if (!this.referenceMaterials || this.referenceMaterials.size === 0) throw new Error('No reference material in method object')
        const data = JSON.stringify({ name: newName });
        const oldReferenceMaterial = this.getReferenceMaterialNameFromId(referenceMaterialId);
        const updatedReferenceMaterial: ReferenceMaterialsResponse = await pb
            .collection('referenceMaterials')
            .update(referenceMaterialId, data);
        if (!updatedReferenceMaterial) throw new Error('Error updating name');

        this.referenceMaterials.delete(oldReferenceMaterial ?? '');
        this.referenceMaterials.set(updatedReferenceMaterial.name, updatedReferenceMaterial);
    }

    getBlankNameFromId(id: string) {
        const blanks = this.blanks;
        for (const blank of blanks?.values() ?? []) {
            if (blank.id === id) return blank.name;
        }
    }

    async updateBlankName(blankId: string, newName: string) {
        if (!this.blanks || this.blanks.size === 0) throw new Error('No blanks in method object')
        const data = JSON.stringify({ name: newName });
        const oldBlank = this.getBlankNameFromId(blankId);
        const updatedBlank: BlanksResponse = await pb
            .collection('blanks')
            .update(blankId, data);
        if (!updatedBlank) throw new Error('Error updating name');

        this.blanks.delete(oldBlank ?? '');
        this.blanks.set(updatedBlank.name, updatedBlank);
    }

    async createNewCheckStandard(name: string) {
        console.log('creating new check standard', name);
        if (!this.id) throw new Error('Method not in database')

        // create check in checks collection
        const data = JSON.stringify({
            name
        })
        const newCheckStandard: CheckStandardsResponse = await pb.collection('checkStandards').create(data);

        // update method blanks to add new blank
        if (!this.checkStandards || this.checkStandards.size === 0) {
            const checkStandardsMap = new Map();
            checkStandardsMap.set(newCheckStandard.name, newCheckStandard);
            this.checkStandards = checkStandardsMap;
        } else this.checkStandards.set(newCheckStandard.name, newCheckStandard);
        const checkStdsData = JSON.stringify({
            checkStandards: this.checkStdsIdList()
        })

        const updatedMethod: MethodsResponse = await pb.collection('methods').update(this.id, checkStdsData);
        if (!updatedMethod) throw new Error('Error updating method check standards')

        // create dl for each element in dl collection
        // create array of new dl ids
        let checkValuesIds: string[] = [];
        for (const currentElement of this.elements ?? []) {

            const checkValueData = JSON.stringify({
                element: currentElement.id
            })
            const newValue: CheckValuesResponse = await pb.collection('checkValues').create(checkValueData);
            if (!newValue) throw new Error('Error adding detection limits');
            checkValuesIds = [...checkValuesIds, newValue.id];
        }
        try {
            const updatedNewCheckStandard: CheckStandardsResponse = await pb.collection('checkStandards').update(newCheckStandard.id, { "checkValues": checkValuesIds }, { expand: 'checkValues' })
            if (!updatedNewCheckStandard) throw new Error('Error updating detection limit ids');
            this.checkStandards.set(updatedNewCheckStandard.name, updatedNewCheckStandard)
            return updatedNewCheckStandard;
        } catch (err) {
            const error = err as Error;
            console.error(error.message);

        }
    }

    async createNewReferenceMaterial(name: string) {
        console.log('creating new reference material', name);
        if (!this.id) throw new Error('Method not in database')

        // create rm in referenceMaterials collection
        const data = JSON.stringify({
            name,
            active: true
        })
        const newReferenceMaterial: ReferenceMaterialsResponse = await pb.collection('referenceMaterials').create(data);

        // update method reference materials to include new one
        if (!this.referenceMaterials || this.referenceMaterials.size === 0) {
            const materialsMap = new Map();
            materialsMap.set(newReferenceMaterial.name, newReferenceMaterial)
            this.referenceMaterials = materialsMap;
        } else this.referenceMaterials.set(newReferenceMaterial.name, newReferenceMaterial);
        const referencesData = JSON.stringify({
            referenceMaterials: this.referenceMaterialsIdList()
        });

        const updatedMethod: MethodsResponse = await pb.collection('methods').update(this.id, referencesData);
        if (!updatedMethod) throw new Error('Error updating method reference materials');

        // create range for each element in materials collection
        // create array of new range ids
        let rangeIds: string[] = [];
        for (const currentElement of this.elements ?? []) {

            const rangeData = JSON.stringify({
                element: currentElement.id
            })
            const range: DetectionLimitsResponse = await pb.collection('referenceMaterialsRanges').create(rangeData);
            if (!range) throw new Error('Error adding new ranges');
            rangeIds = [...rangeIds, range.id];
        }

        const updatedNewReferenceMaterial: ReferenceMaterialsResponse = await pb.collection('referenceMaterials').update(newReferenceMaterial.id, { "ranges": rangeIds }, { expand: 'ranges' })
        if (!updatedNewReferenceMaterial) throw new Error('Error updating rm range ids');
        this.referenceMaterials.set(updatedNewReferenceMaterial.name, updatedNewReferenceMaterial)
        return updatedNewReferenceMaterial;
    }

    elementIdList() {
        return this.elements?.map(element => element.id) ?? [];
    }

    unitsIdList() {
        return this.elements?.map(element => element.unitsId) ?? [];
    }

    blanksIdList() {
        const idList: string[] = []
        for (const blankRecord of this.blanks?.values() ?? []) {
            idList.push(blankRecord.id)
        }
        return idList
    }

    referenceMaterialsIdList() {
        const idList: string[] = []
        for (const referenceMaterial of this.referenceMaterials?.values() ?? []) {
            idList.push(referenceMaterial.id)
        }
        return idList
    }

    checkStdsIdList() {
        const idList: string[] = []
        for (const checkStdRecord of this.checkStandards?.values() ?? []) {
            idList.push(checkStdRecord.id)
        }
        return idList
    }

    getValue(sampleType: SampleType, name: string, expandType: ExpandType, element: string) {
        if (!this[sampleType]?.has(name)) return null;
        const targetSample = this[sampleType]?.get(name);

        if (!targetSample?.expand || !targetSample.expand[expandType]) return null;
        const targetElements = targetSample.expand[expandType].find((x: CheckValuesResponse) => x.element === element);
        return targetElements;

    }

    getElementIdFromMass(mass: number) {
        return this.elements?.find(element => element.mass === mass)?.id;
    }

    getReferenceMaterialNameByName(name: string) {
        const rms = Array.from(this.referenceMaterials?.values() ?? [])
        return rms?.find(rm => rm.name.toLowerCase() === name.toLowerCase())
    }

    getLowestLoqs() {
        const blanks = this.blanks;
        const lowestLoqs = new Map();
        if (!blanks) return lowestLoqs;
        for (const blank of blanks.values()) {
            const detectionLimits = blank.expand?.detectionLimits;
            for (const dl of detectionLimits) {
                const mass = this.elements?.find(e => e.id === dl.element)?.mass;
                if (!lowestLoqs.has(mass)) lowestLoqs.set(mass, dl.loq);
                else if (lowestLoqs.get(mass).loq > dl.loq) lowestLoqs.set(mass, dl.loq);
            }
        }
        return lowestLoqs;
    }

    get title() {
        if (!this.description) return this.name
        return `${this.name}: ${this.description}`
    }

    get blankNames() {
        if (!this.blanks || this.blanks.size === 0) return [];
        return [...this.blanks.keys()];
    }

    get lowerCaseBlankNames() {
        return this.blankNames.map(blank => blank.toLowerCase());
    }

    get checkStandardNames() {
        if (!this.checkStandards || this.checkStandards.size === 0) return [];
        return [...this.checkStandards.keys()];
    }

    get lowerCaseCheckStandardNames() {
        return this.checkStandardNames.map(std => std.toLowerCase());
    }

    get referenceMaterialNames() {
        if (!this.referenceMaterials || this.referenceMaterials.size === 0) return [];
        return [...this.referenceMaterials.keys()];
    }

    get lowerCaseReferenceMaterialNames() {
        return this.referenceMaterialNames.map(rm => rm.toLowerCase());
    }
}
