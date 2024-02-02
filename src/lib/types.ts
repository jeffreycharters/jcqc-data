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

export type Method = {
	name: string
	description: string
	slug: string
	active: boolean
	rpdLimit: number
	calibrationCount: number
	checkStandardTolerance: number
	created: Date
	updated: Date
	elements?: Element[]
	checkStandards?: CheckStandard[]
	blanks?: Blank[]
	referenceMaterials?: ReferenceMaterial[]
}

export type Element = {
	symbol: string
	mass: number
	active: boolean
}

export type CheckStandard = {
	name: string
	values: Record<ElementID, number>
}

export type DetectionLimits = {
	mdl?: number
	loq?: number
}

export type Blank = {
	name: string
	detectionLimits: Record<ElementID, DetectionLimits>
}

export type ReferenceRanges = {
	lower?: number
	upper?: number
}

export type ReferenceMaterial = {
	name: string
	ranges: Record<ElementID, ReferenceRanges>
}

export type Instrument = {
	id: string
	autosamplerInfo: string
	name: string
	serial: string
	softwareVersion: string
}
