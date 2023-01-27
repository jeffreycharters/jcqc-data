import { pb } from "$lib/pocketbase";
import type { ElementsResponse } from "$lib/pocketbase-types";
import type { PageLoad } from "./$types";


export const load = (async () => {
    const elementList: ElementsResponse[] = await pb.collection('elements').getFullList(undefined, { sort: 'mass' });
    return {
        title: 'Edit Elements',
        elementList
    }
}) satisfies PageLoad;