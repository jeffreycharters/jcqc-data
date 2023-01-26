import { pb } from "./pocketbase";
import type { BlanksResponse, MethodsResponse } from "./pocketbase-types";

export const getMethodWithBlanksById = async (methodId: string) => {
    const methodWithBlanks: MethodsResponse = await pb.collection('methods').getOne(methodId, { expand: 'blanks' })
    return methodWithBlanks;
}

export const getBlanksByMethodId = async (methodId: string) => {
    const method: MethodsResponse = await getMethodWithBlanksById(methodId);
    const blanks: BlanksResponse[] = method.expand?.blanks;
    return blanks
}


export const createBlank = async (name: string) => {
    const data = JSON.stringify({ name });
    const newBlank: BlanksResponse = await pb.collection('blanks').create(data);
    return newBlank;
}

export const updateMethodBlankList = async (methodId: string, blankList: string[]) => {
    const data = JSON.stringify({ blanks: blankList })
    const updatedMethod: MethodsResponse = await pb.collection('methods').update(methodId, data);
    return updatedMethod;
}