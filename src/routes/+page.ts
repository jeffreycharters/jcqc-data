import { setMethods } from "$lib/methods"
import { pb } from "$lib/pocketbase"
import type { InstrumentsResponse } from "$lib/pocketbase-types"
import { methodStore, instruments } from "$lib/stores"
import type { PageLoad } from "./$types"

export const load: PageLoad = (async () => {
	const instrumentList: InstrumentsResponse[] = await pb.collection("instruments").getFullList()
	instruments.set(instrumentList)

	await setMethods("active=true")

	methodStore.set(null)
	return {
		title: "JCQC Data Processor"
	}
}) satisfies PageLoad
