import { pb } from "$lib/pocketbase";
import type { MethodsResponse } from "$lib/pocketbase-types";
import { methods } from "$lib/stores";
import type { PageLoad } from "./$types";


export const load = (async () => {
    const methodList: MethodsResponse[] = await pb.collection('methods').getFullList(200, { sort: 'name' });
    methods.set(methodList)
    return {
        title: 'Edit Methods',
        methodList
    }
}) satisfies PageLoad;