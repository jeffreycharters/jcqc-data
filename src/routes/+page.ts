import { getActiveMethods } from "$lib/methods";
import type { PageLoad } from "./$types";

export const load = (async () => {
    const methods = await getActiveMethods();
    return { title: 'Method Select', methods }
}) satisfies PageLoad;