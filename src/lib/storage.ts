import { writable, type Writable } from "svelte/store"
import { getContext, setContext } from "svelte"
import { browser } from "$app/environment"
import type { Instrument, Method, Element, MethodElement, CheckStandard } from "./db"

export function contextFactory<Titem = unknown>(
	contextKey: string
): [(item: Titem | null) => Writable<Titem | null>, () => Writable<Titem | null>] {
	const setter = (item: Titem | null): Writable<Titem | null> => {
		if (!browser) return writable(null)
		const itemStore = writable(item)
		setContext(contextKey, itemStore)
		return itemStore
	}

	const getter = (): Writable<Titem | null> => {
		if (!browser) return writable(null)
		return getContext<Writable<Titem | null>>(contextKey)
	}

	return [setter, getter]
}

const ELEMENTS_CTX = "ELEMENTS_CTX"
const EDITABLE_ELEMENTS_CTX = "EDITABLE_ELEMENTS_CTX"

const INSTRUMENT_CTX = "INSTRUMENT_CTX"
const INSTRUMENTS_CTX = "INSTRUMENTS_CTX"

const METHOD_CTX = "METHOD_CTX"
const METHODS_CTX = "METHODS_CTX"

const METHODELEMENTS_CTX = "METHODELEMENTS_CTX"

const CHECKSTANDARD_CTX = "CHECKSTANDARD_CTX"
const CHECKSTANDARDS_CTX = "CHECKSTANDARDS_CTX"

export const [setInstrumentsContext, getInstrumentsContext] =
	contextFactory<Instrument[]>(INSTRUMENTS_CTX)

export const [setInstrumentContext, getInstrumentContext] = contextFactory<string>(INSTRUMENT_CTX)

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
