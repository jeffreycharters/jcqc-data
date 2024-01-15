import { pb } from "$lib/pocketbase"
import type { ElementsResponse } from "$lib/pocketbase-types"
import type { PageLoad } from "./$types"

export const load = (async () => {
	const elementList: ElementsResponse[] = await pb
		.collection("elements")
		.getFullList(undefined, { sort: "mass" })

	let editableList: string[] = []

	for (let element of elementList) {
		const inUse = await pb
			.collection("methodElements")
			.getFirstListItem(`element="${element.id}"`)
			.then(() => true)
			.catch(() => false)

		if (!inUse) editableList = [...editableList, element.id]
	}

	return {
		title: "Edit Elements",
		elementList,
		editableList
	}
}) satisfies PageLoad
