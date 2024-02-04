import Dexie, { type Table } from "dexie"
import type { ElementID, RunListEntry } from "../app"

export class JCQCDexie extends Dexie {
	instruments!: Table<Instrument>
	elements!: Table<Element>
	methods!: Table<Method>
	methodElements!: Table<MethodElement>
	checkStandards!: Table<CheckStandard>
	referenceMaterials!: Table<ReferenceMaterial>
	blanks!: Table<Blank>

	constructor() {
		super("habaneros")
		this.version(1).stores({
			instruments: "&id, slug",
			elements: "&id, [mass+symbol]",
			methods: "&slug, slug",
			methodElements: "&[element+method], method",
			checkStandards: "&id, method",
			referenceMaterials: "&id, method",
			blanks: "&id, method"
		})
	}
}

export const db = new JCQCDexie()

export type Method = {
	name: string
	description: string
	slug: string
	active: boolean
	rpdLimit: number
	calibrationCount: number
	checkStandardTolerance: number
	reportSigFigs: number
	elements?: Element[]
	checkStandards?: CheckStandard[]
	blanks?: Blank[]
	referenceMaterials?: ReferenceMaterial[]
}

export type Element = {
	id: string
	symbol: string
	mass: number
	active: boolean
}

export type MethodElement = {
	element: string
	method: string
	units: "ppb" | "ppm"
}

export type CheckStandard = {
	id: string
	name: string
	values: Record<ElementID, number>
}

export type Blank = {
	id: string
	name: string
	mdls: Record<ElementID, number>
	loqs: Record<ElementID, number>
}

export type ReferenceMaterial = {
	id: string
	name: string
	active: boolean
	method: string
	lower: Record<ElementID, number>
	upper: Record<ElementID, number>
}

export type Instrument = {
	id: string
	name: string
	autosamplerInfo: string
	serial: string
	softwareVersion: string
}

export type ReportData = {
	meta: {
		analysisName: string
		analysisDate: string
		elementCount: number
	}
	samples: RunListEntry[]
}
