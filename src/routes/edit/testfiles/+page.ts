import { browser } from "$app/environment"
import { db } from "$lib/db"
import type { PageLoad } from "./$types"

export const load = (async () => {
	const title = "Generate test files"
	if (!browser) return { title }

	const methodList = await db.methods.toArray()

	return {
		title,
		methodList
	}
}) satisfies PageLoad
