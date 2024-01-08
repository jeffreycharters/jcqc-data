import { writable, type Writable } from "svelte/store"
import type {
	ElementsResponse,
	InstrumentsResponse,
	MethodsResponse,
	ReferenceMaterialsResponse
} from "./pocketbase-types"
import type { RunListEntry } from "../app"
import type { ElementsExpanded, Units } from "./types"

export const methods: Writable<MethodsResponse[]> = writable([])

export const method: Writable<MethodsResponse<Units, ElementsExpanded> | null> = writable()

export const allElements: Writable<ElementsResponse[]> = writable([])

export const showAddForm: Writable<boolean> = writable(false)

export const instrument: Writable<InstrumentsResponse> = writable()

export const referenceMaterials: Writable<ReferenceMaterialsResponse[]> = writable([])

export const reportData: Writable<RunListEntry[]> = writable()

export const instruments: Writable<InstrumentsResponse[]> = writable()
