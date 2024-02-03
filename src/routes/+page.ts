import { browser } from "$app/environment"
import { db } from "$lib/db"
import type { PageLoad } from "./$types"

export const load: PageLoad = (async () => {
	const title = "JCQC Method"

	if (!browser) return {}

	const selectedInstrument: string = localStorage.getItem("instrument") ?? ""
	const instruments = await db.instruments.toArray()
	const methods = await db.methods.toArray()
	// console.log(selectedInstrument, instruments)

	// if (url.searchParams.has("slug")) {
	// 	// TODO: Grab method and return to page
	// }

	return {
		title,
		methods,
		instruments,
		selectedInstrument
	}
}) satisfies PageLoad
