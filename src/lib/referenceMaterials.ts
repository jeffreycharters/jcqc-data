import { pb } from './pocketbase';
import type { ElementsResponse, MethodElementsResponse, MethodReferenceMaterialsResponse, ReferenceMaterialsResponse } from './pocketbase-types';


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