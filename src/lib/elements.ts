import { pb } from "./pocketbase"
import type { ElementsResponse, MethodElementsResponse } from "./pocketbase-types"
import { methodElementsStore } from "./stores"
import type { Units } from "./types"

export const availableUnits: Units[] = ["ppb", "ppm"]

export const getElementList = async (): Promise<ElementsResponse[]> => {
	return await pb.collection("elements").getFullList(undefined, { sort: "mass" })
}

export async function setMethodElements(methodID: string) {
	const methodElements: MethodElementsResponse<{ element: ElementsResponse }>[] = await pb
		.collection("methodElements")
		.getFullList({ filter: `method="${methodID}"`, expand: "element" })

	methodElementsStore.set(
		methodElements.map((methodEl) => {
			return {
				id: methodEl.id,
				elementID: methodEl.element,
				units: methodEl.units,
				mass: methodEl.expand!.element.mass,
				symbol: methodEl.expand!.element.symbol,
				active: methodEl.expand!.element.active
			}
		})
	)
}
