import type {
	BlanksResponse,
	CheckStandardsResponse,
	CheckValuesResponse,
	DetectionLimitsResponse,
	ElementsResponse,
	MethodElementsResponse
} from "./pocketbase-types"

export type ExpandedMethod = {
	"methodElements(method)": MethodElementsResponse<ExpandedMethodElement>[]
}

export type ExpandedMethodElement = { element: ElementsResponse }
export type ExpandedCheckStandard = { "checkValues(checkStandard)": CheckValuesResponse[] }
export type ExpandedDetectionLimit = { "detectionLimits(checkStandard)": DetectionLimitsResponse[] }
export type ExpandedBlank = { "detectionLimits(blank)": DetectionLimitsResponse[] }

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

export type CheckStandardStore = CheckStandardsResponse<ExpandedCheckStandard>[]

export type BlanksStore = BlanksResponse<ExpandedBlank>[]
