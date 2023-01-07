import { getElementsByMethod } from '$lib/methods';
import { pb } from '$lib/pocketbase';
import type { MethodsResponse } from '$lib/pocketbase-types';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

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

    const rmList = await pb.collection('referenceMaterials').getFullList(200, { sort: "name" });


    return {
        title: `Editing ${method.name}`,
        method,
        rmList,
        usedElements,
        unusedElements,
        methodElements: allElementsList
    };
}) satisfies PageLoad;