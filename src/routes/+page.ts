import type { PageLoad } from "./$types";

export const load = (() => {
    return { title: 'Home' }
}) satisfies PageLoad;