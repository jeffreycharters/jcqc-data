import { setMethodStores, setMethods } from "$lib/methods"
import { pb } from "$lib/pocketbase"
import type { InstrumentsResponse, MethodsResponse } from "$lib/pocketbase-types"
import { methodStore, instruments } from "$lib/stores"
import { redirect } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import type { ExpandedMethod } from "$lib/types"

export const load: PageLoad = (async ({ params }) => {
	const instrumentList: InstrumentsResponse[] = await pb.collection("instruments").getFullList()
	instruments.set(instrumentList)

	await setMethods()

	if (!params.slug) {
		methodStore.set(null)
		return {
			title: "JCQC Data Processor"
		}
	}

	const methodResponse: MethodsResponse<ExpandedMethod> = await pb
		.collection("methods")
		.getFirstListItem(`slug = "${params.slug}"`, { expand: "elements" })
	if (!methodResponse) {
		throw redirect(302, "/")
	}

	await setMethodStores(methodResponse.id)
	methodStore.set(methodResponse)

	return {
		title: `${methodResponse.name}: ${methodResponse.description}`
	}
}) satisfies PageLoad
