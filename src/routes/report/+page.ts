import { methodStore } from "$lib/stores"
import { get } from "svelte/store"
import type { PageLoad } from "./$types"

export const load = (async () => {
	return {
		title: `${get(methodStore)?.name} report`
	}
}) satisfies PageLoad
