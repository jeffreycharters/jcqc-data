import { redirect } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { allElements, method } from "$lib/stores"
import { pb } from "$lib/pocketbase"
import type { ElementsResponse, MethodsResponse } from "$lib/pocketbase-types"
import type { ElementsExpanded, Units } from "../../../../app"

export const load = (async ({ params }) => {
	if (!params.slug) throw redirect(302, "/edit")
	const slug = params.slug

	const methodResponse: MethodsResponse<Units, ElementsExpanded> = await pb
		.collection("methods")
		.getFirstListItem(`slug = "${slug}"`, { expand: "elements,checkStandards" })
	if (!methodResponse) {
		throw redirect(302, "/edit")
	}

	method.set(methodResponse)

	pb.collection("elements")
		.getFullList(undefined, { filter: "active = true" })
		.then((list) => allElements.set(list as ElementsResponse[]))

	return {
		title: methodResponse.description
	}
}) satisfies PageLoad
