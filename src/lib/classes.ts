import { getBlanksByMethodId } from "./blanks";

export class Blank {


    constructor(
        public id: string | undefined,
        public methodId: string
    ) { }

    async createNew(name: string) {
        const methodBlanks = await getBlanksByMethodId(this.methodId)
        console.log(methodBlanks);


    }

}