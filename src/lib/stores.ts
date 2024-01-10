import { writable, type Writable } from "svelte/store"
import type {
	ElementsResponse,
	InstrumentsResponse,
	MethodsResponse,
	ReferenceMaterialsResponse
} from "./pocketbase-types"
import type { RunListEntry } from "../app"
import type {
	BlanksStore,
	CheckStandardStore,
	ExpandedMethod,
	MethodElement,
	ReferenceMaterialsStore
} from "./types"

export const methods: Writable<MethodsResponse[] | null> = writable([])

export const methodStore: Writable<MethodsResponse<ExpandedMethod> | null> = writable()
export const methodElementsStore: Writable<MethodElement[] | null> = writable()
export const checkStandardsStore: Writable<CheckStandardStore | null> = writable()
export const blanksStore: Writable<BlanksStore | null> = writable()
export const referenceMaterialsStore: Writable<ReferenceMaterialsStore | null> = writable()

export const allElements: Writable<ElementsResponse[] | null> = writable([])

export const showAddForm: Writable<boolean> = writable(false)

export const instrument: Writable<InstrumentsResponse> = writable()

export const referenceMaterials: Writable<ReferenceMaterialsResponse[]> = writable([])

export const reportData: Writable<RunListEntry[]> = writable()

export const instruments: Writable<InstrumentsResponse[]> = writable()
