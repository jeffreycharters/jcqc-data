import { pb } from "./pocketbase"
import type { MethodsResponse } from "./pocketbase-types"

export const getMethodList = async (sort = "name"): Promise<MethodsResponse[]> => {
	return await pb.collection("methods").getFullList(undefined, { sort })
}

export const getActiveMethods = async (): Promise<MethodsResponse[]> => {
	return pb.collection("methods").getFullList(200, { filter: "active = true" })
}

export const expandedCollections = "blanks,checkStandards,referenceMaterials"
