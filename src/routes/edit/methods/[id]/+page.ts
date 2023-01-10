import { getElementsByMethod, getLoqsByMethodId } from '$lib/methods';
import { pb } from '$lib/pocketbase';
import type { MethodsResponse } from '$lib/pocketbase-types';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getMaterialsByMethod } from '$lib/referenceMaterials';

export const load = (async ({ params }) => {
    const methodId = params.id;
    let method: MethodsResponse | null = null;
    try {
        method = await pb.collection('methods').getOne(methodId);
    } catch (err) {
        const error = err as Error;
        console.log(error.message);
    }
    if (!method) {
        throw redirect(302, '/edit/methods');
    }

    const { usedElements, unusedElements, allElementsList } = await getElementsByMethod(method.id);
    const { usedReferenceMaterials, unusedReferenceMaterials } = await getMaterialsByMethod(method.id);

    const loqList = await getLoqsByMethodId(method.id);

    return {
        title: `Editing ${method.name}`,
        method,
        usedElements,
        unusedElements,
        loqList,
        usedReferenceMaterials,
        unusedReferenceMaterials,
        methodElements: allElementsList
    };
}) satisfies PageLoad;