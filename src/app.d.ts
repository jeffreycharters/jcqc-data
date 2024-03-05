// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { Blank, CheckStandard, ReferenceMaterial } from "$lib/db"

declare global {
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

	type Runlist = {
		meta: {
			analysisName
			analysisDate
			elementCount
		}
		samples: runlist
	}
}
