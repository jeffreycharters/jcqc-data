import { browser } from "$app/environment"
import { db } from "$lib/db"
import type { PageLoad } from "./$types"

export const load = (async () => {
	if (!browser) return {}

	const methods = (await db.methods.toArray()).toSorted((a, b) => (a.name < b.name ? -1 : 1))
	const instruments = (await db.instruments.toArray()).toSorted((a, b) =>
		a.name < b.name ? -1 : 1
	)

	return {
		methods,
		instruments,
		title: "Edit Stuff"
	}
}) satisfies PageLoad
