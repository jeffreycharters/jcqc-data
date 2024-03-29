import { writable, type Writable } from "svelte/store"
import { getContext, setContext } from "svelte"
import { browser } from "$app/environment"
import {
	type Instrument,
	type Method,
	type Element,
	type MethodElement,
	type CheckStandard,
	type Blank,
	type ReferenceMaterial,
	type ReportData
} from "./db"

export function contextFactory<Titem = unknown>(
	contextKey: string
): [(item: Titem | undefined) => Writable<Titem | undefined>, () => Writable<Titem | undefined>] {
	const setter = (item: Titem | undefined): Writable<Titem | undefined> => {
		if (!browser) return writable(undefined)
		const itemStore = writable(item)
		setContext(contextKey, itemStore)
		return itemStore
	}

	const getter = (): Writable<Titem | undefined> => {
		if (!browser) return writable(undefined)
		return getContext<Writable<Titem | undefined>>(contextKey)
	}

	return [setter, getter]
}

const BLANK_CTX = "BLANK_CTX"
const BLANKS_CTX = "BLANKS_CTX"

const ELEMENTS_CTX = "ELEMENTS_CTX"
const EDITABLE_ELEMENTS_CTX = "EDITABLE_ELEMENTS_CTX"

const INSTRUMENT_CTX = "INSTRUMENT_CTX"
const INSTRUMENTS_CTX = "INSTRUMENTS_CTX"

const METHOD_CTX = "METHOD_CTX"
const METHODS_CTX = "METHODS_CTX"

const METHODELEMENTS_CTX = "METHODELEMENTS_CTX"

const CHECKSTANDARD_CTX = "CHECKSTANDARD_CTX"
const CHECKSTANDARDS_CTX = "CHECKSTANDARDS_CTX"

const REFERENCEMATERIAL_CTX = "REFERENCEMATERIAL_CTX"
const REFERENCEMATERIALS_CTX = "REFERENCEMATERIALS_CTX"

const REPORTDATA_CTX = "REPORTDATA_CTX"

export const [setInstrumentsContext, getInstrumentsContext] =
	contextFactory<Instrument[]>(INSTRUMENTS_CTX)

export const [setInstrumentContext, getInstrumentContext] =
	contextFactory<Instrument>(INSTRUMENT_CTX)

export const [setMethodContext, getMethodContext] = contextFactory<Method>(METHOD_CTX)

export const [setMethodsContext, getMethodsContext] = contextFactory<Method[]>(METHODS_CTX)

export const [setElementsContext, getElementsContext] = contextFactory<Element[]>(ELEMENTS_CTX)

export const [setEditableElementsContext, getEditableElementsContext] =
	contextFactory<string[]>(EDITABLE_ELEMENTS_CTX)

export const [setMethodElementsContext, getMethodElementsContext] =
	contextFactory<MethodElement[]>(METHODELEMENTS_CTX)

export const [setCheckStandardsContext, getCheckStandardsContext] =
	contextFactory<CheckStandard[]>(CHECKSTANDARDS_CTX)

export const [setCheckStandardContext, getCheckStandardContext] =
	contextFactory<CheckStandard>(CHECKSTANDARD_CTX)

export const [setBlankContext, getBlankContext] = contextFactory<Blank>(BLANK_CTX)

export const [setBlanksContext, getBlanksContext] = contextFactory<Blank[]>(BLANKS_CTX)

export const [setReferenceMaterialContext, getReferenceMaterialContext] =
	contextFactory<ReferenceMaterial>(REFERENCEMATERIAL_CTX)

export const [setReferenceMaterialsContext, getReferenceMaterialsContext] =
	contextFactory<ReferenceMaterial[]>(REFERENCEMATERIALS_CTX)

export const [setReportDataContext, getReportDataContext] =
	contextFactory<ReportData>(REPORTDATA_CTX)
