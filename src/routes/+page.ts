import { browser } from "$app/environment"
import { db } from "$lib/db"
import type { PageLoad } from "./$types"

export const load: PageLoad = (async () => {
	const title = "JCQC Method"

	if (!browser) return { title }

	const storedInstrument = localStorage.getItem("instrument")
	const selectedInstrument = JSON.parse(storedInstrument ?? "{}")

	const instruments = (await db.instruments.toArray()).toSorted((a, b) =>
		a.name < b.name ? -1 : 1
	)

	const methods = (await db.methods.toArray()).filter((m) => m.active)
	const selectedMethod = methods.find((m) => m.slug === localStorage.getItem("method"))

	return {
		title,
		methods,
		selectedMethod,
		selectedInstrument: selectedInstrument.name ? selectedInstrument : undefined,
		instruments
	}
}) satisfies PageLoad
