import { browser, dev } from "$app/environment"
import { db } from "$lib/db"
import { addSomeElements, addSomeMethods } from "$lib/fixtures"
import type { PageLoad } from "./$types"

export const load = (async () => {
	if (!browser) return {}

	if (dev && (await db.methods.toArray()).length === 0) await addSomeMethods()
	if (dev && (await db.elements.toArray()).length === 0) await addSomeElements()

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
