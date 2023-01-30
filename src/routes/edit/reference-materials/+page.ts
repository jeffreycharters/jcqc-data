import { pb } from '$lib/pocketbase';
import type { ReferenceMaterialsResponse } from '$lib/pocketbase-types';
import { referenceMaterials } from '$lib/stores';
import type { PageLoad } from './$types';

export const load = (async () => {
    const referenceMaterialList: ReferenceMaterialsResponse[] | null = await pb.collection('referenceMaterials').getFullList(undefined, { sort: 'name' })

    referenceMaterials.set(referenceMaterialList);

    return {
        title: "Reference Materials",
    };
}) satisfies PageLoad;