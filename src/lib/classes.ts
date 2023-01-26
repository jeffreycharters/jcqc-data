import { createBlank, getBlanksByMethodId, updateMethodBlankList } from "./blanks";
import { pb } from "./pocketbase";
import type { MethodsResponse } from "./pocketbase-types";

export class Method {
    active?: boolean
    calibrationCount?: number
    checkStandardName?: string
    checkStandardTolerance?: number
    description?: string
    name?: string;
    rpdLimit?: number
    slug?: string

    constructor(
        public id: string | undefined
    ) { }

    async init() {
        console.log('initiating method', this.id);
        if (!this.id) throw new Error('Method has no id');

        const methodResponse: MethodsResponse = await pb.collection('methods').getOne(this.id);
        if (!methodResponse) throw new Error('Method not found in database');


        for (const [key, value] of Object.entries(methodResponse)) {

            if (Object.hasOwn(this, key)) {
                Object.defineProperty(this, key, { value, writable: true })
            }
        }
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