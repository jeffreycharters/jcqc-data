import { pb } from './pocketbase';
import type { ElementsResponse, MethodElementsResponse, MethodsResponse } from './pocketbase-types';


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