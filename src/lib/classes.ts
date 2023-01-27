import { element } from "svelte/internal";
import { createBlank, getBlanksByMethodId, updateMethodBlankList } from "./blanks";
import { pb } from "./pocketbase";
import type { ElementsResponse, MethodsResponse, UnitsResponse } from "./pocketbase-types";

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
        }
        let expandString = '';
        if (expandList.length > 0) {
            expandString = expandList.join(',');
        }

        const methodsResponse: MethodsResponse = await pb.collection('methods').getOne(this.id, { expand: expandString });
        if (!methodsResponse) throw new Error('Method not found in database');
        this.setPropertiesFromMethodsResponse(methodsResponse);

        if (options.elements) this.populateElements(methodsResponse.expand?.elements, methodsResponse.expand?.units);
        if (options.blanks) this.populateBlankMap();
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

    private populateBlankMap() {
        console.log('populating blankMap'); // TODO
    }

    private populateReferenceMaterialMap() {
        console.log('populating referenceMaterialMap'); // TODO

    }
    async addElement(elementId: string) {
        if (!this.id) throw new Error('Method not in database');
        console.log('adding element', elementId);

        const unitsData = JSON.stringify({ element: elementId, units: 'ppm' })
        const newUnits: UnitsResponse = await pb.collection('units').create(unitsData);

        const unitsList = [...this.unitsIdList(), newUnits.id];
        let elementList = [...this.elementIdList(), elementId];

        console.log(unitsList, elementList);

        const elementsData = JSON.stringify({ elements: elementList, units: unitsList })
        const updatedMethod: MethodsResponse = await pb.collection('methods').update(this.id, elementsData);

        if (!updatedMethod || !newUnits) throw new Error('Error adding element')

    }

    elementIdList() {
        return this.elements?.map(element => element.id) ?? [];
    }

    unitsIdList() {
        return this.elements?.map(element => element.unitsId) ?? [];
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