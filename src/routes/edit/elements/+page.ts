import { browser } from "$app/environment"
import { db } from "$lib/db"
import type { PageLoad } from "./$types"

export const load = (async () => {
	if (!browser) return

	const elementList = await db.elements.orderBy("mass").toArray()
	let editableList: string[] = []

	for (const element of elementList) {
		const inUse = (await db.methodElements.where({ element: element.id }).count()) > 0

		if (!inUse) editableList = [...editableList, element.id]
	}

	return {
		title: "Edit Elements",
		elementList,
		editableList
	}
}) satisfies PageLoad
