import { pb } from './pocketbase';
import type { ElementsResponse, LoqsResponse, MethodElementsResponse, MethodsResponse } from './pocketbase-types';

export const getMethodList = async (sort = "name") => {
    const methodList: MethodsResponse[] = await pb.collection('methods').getFullList(200, { sort });
    return methodList;
}

export const getActiveMethods = async () => {
    const activeMethods: MethodsResponse[] = await pb.collection('methods').getFullList(200, { filter: 'active = true' });
    return activeMethods;
}

export const getElementList = async () => {
    const elementList: ElementsResponse[] = await pb.collection('elements').getFullList(200, { sort: 'mass', filter: `retired = false` });
    return elementList;
}

export const getMethodElementsByMethodId = async (methodId: string) => {
    const methodElements: MethodElementsResponse[] = await pb.collection('methodElements').getFullList(200, { filter: `method = "${methodId}"` });
    return methodElements;
}


export const getMethodById = async (methodId: string) => {
    const method: MethodsResponse = await pb.collection('methods').getOne(methodId);
    return method;
}

export const getElementsByMethod = async (methodId: string) => {
    const elements: ElementsResponse[] = await pb.collection('elements').getFullList(200, { sort: 'mass', filter: 'retired = false' });

    // create a list of element IDs used by the method
    const allElementsList: MethodElementsResponse[] = await pb.collection('methodElements').getFullList(200, { filter: `method = "${methodId}"` });
    const activeElementsList = allElementsList.filter(e => e.active);
    const elementIds = allElementsList.map(e => e.element);
    const activeElementIds = activeElementsList.map(e => e.element);

    // Check and see if each element is in that list or not.
    const usedElements = elements.filter(e => activeElementIds.includes(e.id));
    const unusedElements = elements.filter(e => !elementIds.includes(e.id));

    return {
        usedElements,
        unusedElements,
        allElementsList
    }
}

export const getActiveElementsByMethodId = async (methodId: string) => {
    const activeElements: MethodElementsResponse[] = await pb.collection('methodElements').getFullList(200, { filter: `method = "${methodId}" && active = true` });
    return activeElements;
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
    const loq: LoqsResponse = await pb.collection('loqs').getFirstListItem(`method = "${methodId}" && element = "${elementId}"`);
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
export const getOrCreateMethodElement = async (methodId: string, elementId: string) => {
    let existing: MethodElementsResponse | null = null;
    try {
        existing = await pb.collection('methodElements').getFirstListItem(`method = "${methodId}" && element = "${elementId}"`);
    } catch (e) {
        const err = e as Error;
        console.log(err.message);
    }

    if (existing) {
        if (!existing.active) await pb.collection('methodElements').update(existing.id, JSON.stringify({ active: true }))
        return existing;
    }
    const newData = JSON.stringify({
        method: methodId,
        element: elementId,
        active: true,
        units: 'ppb',
    })
    const newMethodElement: MethodElementsResponse = await pb.collection('methodElements').create(newData);
    return newMethodElement;
}

export const toggleMethodElementActive = async (methodElementId: string, newActiveState: boolean) => {
    const data = JSON.stringify({ active: newActiveState, units: 'ppb' });
    const updatedElement: MethodElementsResponse = await pb.collection('methodElements').update(methodElementId, data)
    return updatedElement;
}

export const createMethodElement = async (elementId: string, methodId: string) => {
    const data = JSON.stringify({ method: methodId, element: elementId, active: true, units: 'ppb' });

    const newElement: MethodElementsResponse = await pb.collection('methodElements').create(data);
    return newElement
}

export const inactivateMethodElement = async (methodElementId: string) => {
    const data = JSON.stringify({ active: false });
    const updatedMethodelement = await pb.collection('methodElements').update(methodElementId, data);
    return updatedMethodelement;
}

export const updateElementLoq = async (loqId: string, value: number) => {
    const data = JSON.stringify({ value });
    const updatedLoq = await pb.collection('loqs').update(loqId, data);
    return updatedLoq;
}

export const createElementLoq = async (methodId: string, elementId: string, value: number | undefined) => {
    const data = JSON.stringify({ method: methodId, element: elementId, value });
    const newLoq: LoqsResponse = await pb.collection('loqs').create(data);
    return newLoq;
}

export const setMethodElementUnitsById = async (methodElementId: string, newUnits: Units) => {
    const data = JSON.stringify({
        units: newUnits,
    })
    const updatedMethodelement: MethodElementsResponse = await pb.collection('methodElements').update(methodElementId, data);
    return updatedMethodelement;
}

export const setCalCheckValueByMethodelementId = async (methodElementId: string, checkStandard: number) => {
    const updatedMethodElement: MethodElementsResponse = await pb.collection('methodElements').update(methodElementId, JSON.stringify({ checkStandard }));
    return updatedMethodElement;
}