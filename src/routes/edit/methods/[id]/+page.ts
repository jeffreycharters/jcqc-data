import { pb } from '$lib/pocketbase';
import type { ElementsResponse, MethodElementsResponse, MethodsResponse } from '$lib/pocketbase-types';
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

    const elements: ElementsResponse[] = await pb.collection('elements').getFullList(200, { sort: 'mass', filter: 'retired = false' });

    // create a list of element IDs used by the method
    const usedElementList: MethodElementsResponse[] = await pb.collection('methodElements').getFullList(200, { filter: `method = "${method.id}"` });
    const elementIds = usedElementList.map(e => e.element)

    // Check and see if each element is in that list or not.
    const usedElements = elements.filter(e => elementIds.includes(e.id));
    const unusedElements = elements.filter(e => !elementIds.includes(e.id));


    return {
        method,
        usedElements,
        unusedElements,
        methodElements: usedElementList
    };
}) satisfies PageLoad;