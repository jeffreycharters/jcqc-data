import { pb } from './pocketbase';
import type { ElementsResponse, LoqsResponse, MethodElementsResponse, MethodsResponse } from './pocketbase-types';


export const getMethodById = async (methodId: string) => {
    const method: MethodsResponse = await pb.collection('methods').getOne(methodId);
    return method;
}

export const getElementsByMethod = async (methodId: string) => {
    const elements: ElementsResponse[] = await pb.collection('elements').getFullList(200, { sort: 'mass', filter: 'retired = false' });

    // create a list of element IDs used by the method
    const allElementsList: MethodElementsResponse[] = await pb.collection('methodElements').getFullList(200, { filter: `method = "${methodId}"` });
    const elementIds = allElementsList.map(e => e.element)

    // Check and see if each element is in that list or not.
    const usedElements = elements.filter(e => elementIds.includes(e.id));
    const unusedElements = elements.filter(e => !elementIds.includes(e.id));

    return {
        usedElements,
        unusedElements,
        allElementsList
    }
}

export const getLoqsByMethodId = async (methodId: string) => {
    const loqs: LoqsResponse[] = await pb.collection('loqs').getFullList(200, { filter: `method = "${methodId}"`, expand: "element" });
    return loqs;
}

export const createLoq = async (methodId: string, elementId: string, value: number) => {
    if (isNaN(value)) return;
    const newData = JSON.stringify({
        method: methodId,
        element: elementId,
        value
    })
    const newLoq = await pb.collection('loqs').create(newData);
    return newLoq;
}

export const getLoqByMethodAndElement = async (methodId: string, elementId: string) => {
    const loq: LoqsResponse = await pb.collection('methodElements').getFirstListItem(`method = "${methodId}" && element = "${elementId}"`);
    return loq;
}

export const updateLoqByMethodAndElement = async (methodId: string, elementId: string, value: string | number | undefined) => {
    const loq = await getLoqByMethodAndElement(methodId, elementId);
    const updateData = JSON.stringify({
        value
    });
    const updatedRecord: LoqsResponse = await pb.collection('loqs').update(loq.id, updateData);
    return updatedRecord;
}