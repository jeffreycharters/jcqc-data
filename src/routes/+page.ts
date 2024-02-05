import { browser } from "$app/environment"
import { db } from "$lib/db"
import type { PageLoad } from "./$types"

export const load: PageLoad = (async () => {
	const title = "JCQC Method"

	if (!browser) return { title }

	const storedInstrument = localStorage.getItem("instrument")
	const selectedInstrument = JSON.parse(storedInstrument ?? "")
	const selectedMethod: string = localStorage.getItem("method") ?? ""
	const instruments = await db.instruments.toArray()
	const methods = await db.methods.toArray()

	return {
		title,
		methods,
		selectedMethod,
		selectedInstrument,
		instruments
	}
}) satisfies PageLoad
