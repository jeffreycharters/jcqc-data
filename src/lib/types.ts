import type {
	CheckValuesResponse,
	ElementsResponse,
	MethodElementsResponse
} from "./pocketbase-types"

export type ExpandedMethod = {
	"methodElements(method)": MethodElementsResponse<ExpandedMethodElement>[]
}

export type ExpandedMethodElement = { element: ElementsResponse }
export type ExpandedCheckStandard = { "checkValues(checkStandard)": CheckValuesResponse[] }

export type Units = "ppb" | "ppm"

export type MethodElement = {
	id: string
	elementID: string
	name: string
	symbol: string
	mass: number
	active: boolean
	units: Units
}
