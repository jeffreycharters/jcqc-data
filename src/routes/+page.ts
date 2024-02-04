import { browser } from "$app/environment"
import { db } from "$lib/db"
import type { PageLoad } from "./$types"

export const load: PageLoad = (async () => {
	const title = "JCQC Method"

	if (!browser) return {}

	const selectedInstrument: string = localStorage.getItem("instrument") ?? ""
	const selectedMethod: string = localStorage.getItem("method") ?? ""
	const instruments = await db.instruments.toArray()
	const methods = await db.methods.toArray()

	return {
		title,
		methods,
		selectedMethod,
		instruments,
		selectedInstrument
	}
}) satisfies PageLoad
