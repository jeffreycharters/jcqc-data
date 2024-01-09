import { getActiveMethods } from "$lib/methods"
import { pb } from "$lib/pocketbase"
import type { ElementsResponse, InstrumentsResponse, MethodsResponse } from "$lib/pocketbase-types"
import { methodStore, instruments } from "$lib/stores"
import { redirect } from "@sveltejs/kit"
import type { PageLoad } from "./$types"

export const load: PageLoad = (async ({ params }) => {
	const slug = params.slug
	const methods = await getActiveMethods()

	const instrumentList: InstrumentsResponse[] = await pb.collection("instruments").getFullList()
	instruments.set(instrumentList)

	if (!slug) {
		methodStore.set(null)
		return {
			title: "JCQC Data Processor",
			methods
		}
	}

	const methodResponse: MethodsResponse<unknown, { elements: ElementsResponse[] }> = await pb
		.collection("methods")
		.getFirstListItem(`slug = "${slug}"`, { expand: "elements" })
	if (!methodResponse) {
		throw redirect(302, "/")
	}

	methodStore.set(methodResponse)

	return {
		title: `${methodResponse.name}: ${methodResponse.description}`,
		methods
	}
}) satisfies PageLoad
