import { redirect } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { db } from "$lib/db"
import { browser } from "$app/environment"

export const load = (async ({ params }) => {
	if (!params.slug) throw redirect(302, "/edit")

	if (!browser) return {}

	const currentMethod = await db.methods.where({ slug: params.slug }).first()
	const elementList = (await db.elements.toArray()).filter((e) => e.active)
	const methodElements = await db.methodElements.where("method").equals(params.slug).toArray()
	const checkStandards = (
		await db.checkStandards.where("method").equals(params.slug).toArray()
	).toSorted((a, b) => (a.name < b.name ? -1 : 1))
	const blanks = await db.blanks.where("method").equals(params.slug).toArray()
	const referenceMaterials = await db.referenceMaterials
		.where("method")
		.equals(params.slug)
		.toArray()

	return {
		currentMethod,
		elementList,
		checkStandards,
		blanks,
		methodElements,
		referenceMaterials,
		title: `${currentMethod?.name}: ${currentMethod?.description}`
	}
}) satisfies PageLoad
