// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { Blank, CheckStandard, ReferenceMaterial } from "$lib/db"
import PocketBase from "pocketbase"
declare global {
	declare namespace App {
		interface Locals {
			pb: PocketBase
		}
	}
}

declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

interface SubmissionResult {
	results: Map<string, ElementResult>
	meta: SubmissionMeta
}

interface InputLine {
	name: string
	measurements: Map<number, number>
}

type ElementID = string
type MeasuredConcentration = number

interface RunListEntry {
	name: string
	analysisNumber: number
	isSample?: boolean
	calStandards?: RunlistEntry[]
	checkStandard?: CheckStandard
	blank?: Blank
	referenceMaterial?: ReferenceMaterial
	duplicateSamples?: RunListEntry[]
	referenceBlank?: Blank
	results: Record<ElementID, MeasuredConcentration>
}

type ReferenceMaterialRange = {
	low?: number
	high?: number
}

type CheckStandardValue = {
	expected: number
}

type BlankLimits = {
	mdl: number
	loq: number
}

type SimplifiedComparator<Tcomp = unknown> = {
	name: ElementID
	elements: Record<ElementID, Tcomp>
}

export type Runlist = {
	meta: {
		analysisName
		analysisDate
		elementCount
	}
	samples: runlist
}
