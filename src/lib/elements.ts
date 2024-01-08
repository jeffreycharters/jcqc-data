import { pb } from "./pocketbase"
import type { ElementsResponse } from "./pocketbase-types"

export const getElementList = async (): Promise<ElementsResponse[]> => {
	return await pb.collection("elements").getFullList(undefined, { sort: "mass" })
}
