import { Method } from '$lib/classes';
import { getMethodBySlug } from '$lib/methods';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getElementList } from '$lib/elements';
import { method } from '$lib/stores';
import { pb } from '$lib/pocketbase';


export const load = (async ({ params }) => {
    const slug = params.slug;
    const methodResponse = await getMethodBySlug(slug);
    if (!methodResponse) {
        throw redirect(302, '/edit');
    }
    const currentMethod = new Method(methodResponse.id);
    await currentMethod.init({ blanks: true, elements: true, referenceMaterials: true });
    method.set(currentMethod)

    const elementList = await pb.collection('elements').getFullList(undefined, { filter: 'active = true' });

    return {
        title: `${currentMethod.name}${currentMethod.description ? `: ${currentMethod.description}` : ''}`,
        elementList,
    }
}) satisfies PageLoad;