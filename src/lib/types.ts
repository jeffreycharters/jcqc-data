import type { Blank, CheckStandard, ReferenceMaterial } from "./db"

export type Units = "ppb" | "ppm"

export type MethodElement = {
	id: string
	elementID: string
	symbol: string
	mass: number
	active: boolean
	units: Units
}

export interface ReportMetadata {
	analysisName: string
	analysisDate: string
	elementCount: number
}

export interface InstrumentCSVRow {
	Analyte: string
	Concentration?: number
	"Dilution Factor": number
	Mass: number
	"Sample Name": string
	"Sample Weight or Volume": number
	Units: Units
}

type ElementID = string
type Concentration = number
export type ElementConcentrations = Record<ElementID, Concentration>

export interface RawRunlist {
	name: string
	measurements: Record<ElementID, Concentration>
}

type MeasuredConcentration = number
export interface RunListEntry {
	name: string
	analysisNumber: number
	isSample?: boolean
	calStandards?: RunListEntry[]
	checkStandards: CheckStandard[]
	blank?: Blank[]
	referenceMaterial?: ReferenceMaterial[]
	duplicateSamples?: RunListEntry[]
	referenceBlank?: Blank
	results: Record<ElementID, MeasuredConcentration>
}
