import { Method } from '$lib/classes';
import { getMethodBySlug } from '$lib/methods';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { method } from '$lib/stores';
import { pb } from '$lib/pocketbase';
import type { ElementsResponse } from '$lib/pocketbase-types';


export const load = (async ({ params }) => {
    const slug = params.slug;
    const methodResponse = await getMethodBySlug(slug);
    if (!methodResponse) {
        throw redirect(302, '/edit');
    }
    const currentMethod = new Method(methodResponse.id);
    await currentMethod.init({ blanks: true, elements: true, referenceMaterials: true });
    method.set(currentMethod)

    const elementList: ElementsResponse[] = await pb.collection('elements').getFullList(undefined, { filter: 'active = true' });

    return {
        title: currentMethod.title,
        elementList,
    }
}) satisfies PageLoad;