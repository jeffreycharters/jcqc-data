import { pb } from "./pocketbase"
import type { CheckStandardsResponse, MethodsResponse } from "./pocketbase-types"
import { checkStandardsStore } from "./stores"
import type { ExpandedCheckStandard } from "./types"

export const expandMethod = "methodElements(method).element"

export const getMethodList = async (sort = "name"): Promise<MethodsResponse[]> => {
	return await pb.collection("methods").getFullList(undefined, { sort })
}

export const getActiveMethods = async (): Promise<MethodsResponse[]> => {
	return pb.collection("methods").getFullList(200, { filter: "active = true" })
}

export async function setCheckStandards(methodID: string) {
	const checkStandards = await pb
		.collection("checkStandards")
		.getFullList<CheckStandardsResponse<ExpandedCheckStandard>>({
			filter: `method = "${methodID}"`,
			expand: "checkValues(checkStandard)"
		})

	checkStandardsStore.set(checkStandards)
}
