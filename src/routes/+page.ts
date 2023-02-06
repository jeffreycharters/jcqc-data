import { getActiveMethods } from "$lib/methods";
import { methods } from "$lib/stores";
import type { PageLoad } from "./$types";

export const load = (async () => {
    methods.set(await getActiveMethods());
    return { title: 'Method Select', methods }
}) satisfies PageLoad;