import { pb } from './pocketbase';
import type { MethodReferenceMaterialsResponse, ReferenceMaterialElementsResponse, ReferenceMaterialsResponse } from './pocketbase-types';

export const getReferenceMaterialById = async (materialId: string) => {
    const referenceMaterial: ReferenceMaterialsResponse = await pb.collection('referenceMaterials').getOne(materialId);
    return referenceMaterial;
}

export const getMaterialsByMethod = async (methodId: string) => {
    const allReferenceMaterials: ReferenceMaterialsResponse[] = await pb.collection('referenceMaterials').getFullList(200, { sort: 'name', filter: 'active = true' });

    // create a list of rMs used by the method
    const allRmList: MethodReferenceMaterialsResponse[] = await pb.collection('methodReferenceMaterials').getFullList(200, { filter: `method = "${methodId}" && active = true` });
    const rmIds = allRmList.map(rm => rm.referenceMaterial)

    // Check and see if each element is in that list or not.
    const usedReferenceMaterials = allReferenceMaterials.filter(e => rmIds.includes(e.id));
    const unusedReferenceMaterials = allReferenceMaterials.filter(e => !rmIds.includes(e.id));

    return {
        usedReferenceMaterials,
        unusedReferenceMaterials
    }
}

export const getMethodReferenceMaterialByMethodAndMaterial = async (methodId: string, referenceMaterialId: string) => {
    try {
        const methodReferenceMaterial: MethodReferenceMaterialsResponse = await pb.collection('methodReferenceMaterials')
            .getFirstListItem(`method = "${methodId}" && referenceMaterial = "${referenceMaterialId}"`);
        return methodReferenceMaterial;
    } catch (_) {
        return null;
    }
}

export const getCurrentReferenceElements = async (methodReferenceMaterialId: string) => {
    try {
        const currentReferenceMaterialElements: ReferenceMaterialElementsResponse[] = await pb.collection('referenceMaterialElements')
            .getFullList(200, { filter: `methodReferenceMaterial = "${methodReferenceMaterialId}"` });
        return currentReferenceMaterialElements;
    } catch (_) {
        return []
    }
}

export const createMethodReferenceMaterial = async (methodId: string, referenceMaterialId: string) => {
    const data = JSON.stringify({
        method: methodId,
        referenceMaterial: referenceMaterialId,
        active: true
    })
    const newMaterial: MethodReferenceMaterialsResponse = await pb.collection('methodReferenceMaterials').create(data);
    return newMaterial;
}

export const activateMethodReferenceMaterial = async (id: string) => {
    const activatedMaterial: MethodReferenceMaterialsResponse = await pb.collection('methodReferenceMaterials').update(id, JSON.stringify({ active: true }));
    return activatedMaterial
}