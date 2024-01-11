import { setMethodElements } from "./elements"
import { pb } from "./pocketbase"
import type {
	BlanksResponse,
	CheckStandardsResponse,
	MethodsResponse,
	ReferenceMaterialsResponse
} from "./pocketbase-types"
import { blanksStore, checkStandardsStore, methods, referenceMaterialsStore } from "./stores"
import type {
	ExpandedBlank,
	ExpandedCheckStandard,
	ExpandedMethod,
	ExpandedReferenceMaterial
} from "./types"

export const expandMethod = "methodElements(method).element"

export const getMethodList = async (sort = "name"): Promise<MethodsResponse[]> => {
	return await pb.collection("methods").getFullList({ sort })
}

export const getActiveMethods = async (): Promise<MethodsResponse[]> => {
	return pb.collection("methods").getFullList({ filter: "active = true" })
}

export async function setMethods() {
	const methodList = await pb
		.collection("methods")
		.getFullList<MethodsResponse<ExpandedMethod>>({ expand: expandMethod })

	methods.set(methodList)
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

export async function setMethodStores(methodID: string) {
	await setMethodElements(methodID)
	await setCheckStandards(methodID)
	await setBlanks(methodID)
	await setReferenceMaterials(methodID)
}
