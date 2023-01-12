import { pb } from '$lib/pocketbase';
import type { ReferenceMaterialsResponse } from '$lib/pocketbase-types';
import type { PageLoad } from './$types';

export const load = (async () => {
    const referenceMaterialList: ReferenceMaterialsResponse[] | null = await pb.collection('referenceMaterials').getFullList(200, { sort: 'name' })

    return {
        title: "Reference Materials",
        referenceMaterialList
    };
}) satisfies PageLoad;