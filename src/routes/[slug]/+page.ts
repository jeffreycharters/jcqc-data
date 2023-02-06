import { Method } from '$lib/classes';
import { getMethodBySlug } from '$lib/methods';
import { method } from '$lib/stores';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    const slug = params.slug;
    const methodResponse = await getMethodBySlug(slug);
    if (!methodResponse) {
        throw redirect(302, '/edit');
    }
    const currentMethod = new Method(methodResponse.id);
    await currentMethod.init({ blanks: true, elements: true, referenceMaterials: true, checkStandards: true });
    method.set(currentMethod)
    return {
        title: currentMethod.title
    };
}) satisfies PageLoad;