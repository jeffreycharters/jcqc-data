import { getMethodList } from "$lib/methods"
import { methods } from "$lib/stores"
import type { PageLoad } from "./$types"

export const load = (async () => {
	const methodList = await getMethodList()
	methods.set(methodList)
	return {
		title: "Edit Stuff"
	}
}) satisfies PageLoad
