import { writable, type Writable } from "svelte/store"
import type { Instrument } from "./types"
import { getContext, setContext } from "svelte"
import { browser } from "$app/environment"

const INSTRUMENT_CTX = "instruments"

export function setInstrumentsContext() {
	if (!browser) return
	const instrumentString = localStorage.getItem(INSTRUMENT_CTX)
	const instruments = writable<Instrument[]>(JSON.parse(instrumentString || "[]"))
	setContext(INSTRUMENT_CTX, instruments)
	return instruments
}

export function getInstrumentsContext() {
	if (!browser) return
	return getContext<Writable<Instrument[]>>(INSTRUMENT_CTX)
}
