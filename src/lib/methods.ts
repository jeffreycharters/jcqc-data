import { pb } from "./pocketbase"
import type {
	BlanksResponse,
	CheckStandardsResponse,
	MethodsResponse,
	ReferenceMaterialsResponse
} from "./pocketbase-types"
import { blanksStore, checkStandardsStore, referenceMaterialsStore } from "./stores"
import type { ExpandedBlank, ExpandedCheckStandard, ExpandedReferenceMaterial } from "./types"

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

export async function setBlanks(methodID: string) {
	const blanks = await pb.collection("blanks").getFullList<BlanksResponse<ExpandedBlank>>({
		filter: `method = "${methodID}"`,
		expand: "detectionLimits(blank)"
	})

	blanksStore.set(blanks)
}

export async function setReferenceMaterials(methodID: string) {
	const referenceMaterials = await pb
		.collection("referenceMaterials")
		.getFullList<ReferenceMaterialsResponse<ExpandedReferenceMaterial>>({
			filter: `method = "${methodID}"`,
			expand: "referenceMaterialsRanges(referenceMaterial)"
		})

	referenceMaterialsStore.set(referenceMaterials)
}
