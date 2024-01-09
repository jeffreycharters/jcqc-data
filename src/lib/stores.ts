import { writable, type Writable } from "svelte/store"
import type {
	CheckStandardsResponse,
	ElementsResponse,
	InstrumentsResponse,
	MethodsResponse,
	ReferenceMaterialsResponse
} from "./pocketbase-types"
import type { RunListEntry } from "../app"
import type { ExpandedCheckStandard, ExpandedMethod, MethodElement } from "./types"

export const methods: Writable<MethodsResponse[]> = writable([])

export const methodStore: Writable<MethodsResponse<ExpandedMethod> | null> = writable()
export const methodElementsStore: Writable<MethodElement[]> = writable()
export const checkStandardsStore: Writable<CheckStandardsResponse<ExpandedCheckStandard>[]> =
	writable()

export const allElements: Writable<ElementsResponse[]> = writable([])

export const showAddForm: Writable<boolean> = writable(false)

export const instrument: Writable<InstrumentsResponse> = writable()

export const referenceMaterials: Writable<ReferenceMaterialsResponse[]> = writable([])

export const reportData: Writable<RunListEntry[]> = writable()

export const instruments: Writable<InstrumentsResponse[]> = writable()
