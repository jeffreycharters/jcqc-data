import { browser } from "$app/environment"
import { db } from "$lib/db"
import type { PageLoad } from "./$types"

export const load = (async () => {
	if (!browser) return {}

	const instrumentList = (await db.instruments.toArray()).toSorted((a, b) =>
		a.name < b.name ? -1 : 1
	)

	return {
		instrumentList,
		title: "Edit Stuff"
	}
}) satisfies PageLoad
