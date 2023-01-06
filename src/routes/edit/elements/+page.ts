import { pb } from "$lib/pocketbase";
import type { ElementsResponse } from "$lib/pocketbase-types";
import { elements } from "$lib/stores";
import type { PageLoad } from "./$types";


export const load = (async () => {
    const elementList: ElementsResponse[] = await pb.collection('elements').getFullList(200, { sort: 'mass' });
    elements.set(elementList)
    return {
        title: 'Edit Elements',
        elementList
    }
}) satisfies PageLoad;