import type { CheckStandardsResponse, ElementsResponse } from "./pocketbase-types"

export type Units = Record<string, UnitTypes>

export interface ElementsExpanded {
	elements: ElementsResponse[]
	checkStandards: CheckStandardsResponse[]
}

export enum UnitTypes {
	PPB = "ppb",
	PPM = "ppm"
}
