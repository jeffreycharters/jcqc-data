import { redirect } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { allElements, methodStore } from "$lib/stores"
import { pb } from "$lib/pocketbase"
import type { ElementsResponse, MethodsResponse } from "$lib/pocketbase-types"
import type { ExpandedMethod } from "$lib/types"
import { setMethodStores } from "$lib/methods"

export const load = (async ({ params }) => {
	if (!params.slug) throw redirect(302, "/edit")
	const slug = params.slug

	const method = await pb.collection("methods").getFirstListItem(`slug = "${slug}"`)
	methodStore.set(method as MethodsResponse<ExpandedMethod>)
	await setMethodStores(method.id)

	pb.collection("elements")
		.getFullList({ filter: "active = true" })
		.then((list) => allElements.set(list as ElementsResponse[]))

	return {
		title: `${method.name}: ${method.description}`
	}
}) satisfies PageLoad
