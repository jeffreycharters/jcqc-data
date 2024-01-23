import Papa from "papaparse"
import type {
	InstrumentCSVRow,
	RawRunlist,
	ElementConcentrations,
	ExpandedReferenceMaterial,
	ExpandedCheckStandard,
	ExpandedBlank
} from "./types"
import type {
	BlankLimits,
	CheckStandardValue,
	ElementID,
	ReferenceMaterialRange,
	RunListEntry,
	SimplifiedComparator
} from "../app"
import {
	blanksStore,
	checkStandardsStore,
	methodElementsStore,
	methodStore,
	referenceMaterialsStore
} from "./stores"
import { get } from "svelte/store"
import type {
	BlanksResponse,
	CheckStandardsResponse,
	ReferenceMaterialsResponse
} from "./pocketbase-types"

const qcRegex = /^(qc:)/i
const sampleRegex = /\d{2}-\d{6}-\d{4}/
const dupRegex = /(.*)[\d\s](d|dup)$/i // number or whitespace then "d" or "dup"

export const parseCSV = async (inputFile: File) => {
	const inputString = await inputFile.text()
	const result = Papa.parse<InstrumentCSVRow>(inputString, {
		header: true,
		dynamicTyping: true
	})

	return result.data
}

export function findElementOrder(csvRows: InstrumentCSVRow[]) {
	const elementMap: Record<string, boolean> = {}
	let elements: ElementID[] = []

	for (let i = 0; i < csvRows.length; i++) {
		if (elementMap[csvRows[i].Analyte]) return elements

		elementMap[csvRows[i].Analyte] = true
		elements = [...elements, `${csvRows[i].Analyte}${csvRows[i].Mass}`]
	}

	return elements
}

export function flattenAnalytes(csvRows: InstrumentCSVRow[], elementCount: number) {
	let rawRunlist: RawRunlist[] = []
	let analytes: ElementConcentrations = {}

	for (let i = 0; i < csvRows.length; i++) {
		const elementID = `${csvRows[i].Analyte}${csvRows[i].Mass}`

		analytes = { ...analytes, [elementID]: csvRows[i].Concentration ?? 0 }

		if (i % elementCount === elementCount - 1) {
			rawRunlist = [
				...rawRunlist,
				{
					name: csvRows[i]["Sample Name"]?.trim(),
					measurements: analytes
				}
			]

			analytes = {}
		}
	}

	return rawRunlist
}

export function parseRun(rawRunlist: RawRunlist[]) {
	const method = get(methodStore)
	let runlist: RunListEntry[] = []

	const checkStandards = get(checkStandardsStore)
	const checkStandardNames = checkStandards?.map((c) => c.name.trim().toLowerCase()) ?? []

	const blanks = get(blanksStore)
	const blankNames = blanks?.map((b) => b.name.trim().toLowerCase()) ?? []

	const referenceMaterials = get(referenceMaterialsStore)
	const referenceMaterialNames = referenceMaterials?.map((r) => r.name.trim().toLowerCase()) ?? []

	let mostRecentBlank: SimplifiedComparator<BlankLimits> | undefined

	listLoop: for (let i = 0; i < rawRunlist.length; i++) {
		const name = rawRunlist[i].name?.trim().toLowerCase()

		// special case
		if (name === "cal blank") {
			runlist = [
				...runlist,
				{
					name: rawRunlist[i].name,
					analysisNumber: i,
					calStandards: rawRunlist
						.slice(i + 1, i + (method?.calibrationCount ?? 0) + 1)
						.map((r, index) => {
							return {
								name: r.name,
								analysisNumber: i + index + 1,
								results: r.measurements
							}
						}),
					results: rawRunlist[i].measurements
				}
			]
			continue
		}

		let runlistEntry: RunListEntry = {
			name: rawRunlist[i].name,
			analysisNumber: i,
			results: rawRunlist[i].measurements
		}

		if (dupRegex.test(name)) {
			const refSampleName = dupRegex.exec(name)?.[1] ?? undefined
			if (!refSampleName) break

			for (let j = runlist.length - 1; j >= 0; j--) {
				if (runlist[j].name.toLowerCase() === refSampleName.toLowerCase()) {
					runlist[j] = {
						...runlist[j],
						duplicateSamples: [...(runlist[j].duplicateSamples ?? []), runlistEntry],
						referenceBlank: mostRecentBlank
					}
					continue listLoop
				}
			}
		}

		if (checkStandardNames.includes(name)) {
			const cs = checkStandards?.find((c) => c.name.toLowerCase() === name)
			if (cs) runlistEntry = { ...runlistEntry, checkStandard: simplifiedCheckStandard(cs) }
		}

		if (blankNames.includes(name)) {
			const blk = blanks?.find((b) => b.name.toLowerCase() === name)
			if (blk) {
				runlistEntry = { ...runlistEntry, blank: simplifiedBlank(blk) }
				mostRecentBlank = simplifiedBlank(blk)
			}
		}

		if (referenceMaterialNames.includes(name)) {
			const rm = referenceMaterials?.find((r) => r.name.toLowerCase() === name)
			if (rm) runlistEntry = { ...runlistEntry, referenceMaterial: simplifiedReferenceMaterial(rm) }
		}

		if (sampleRegex.test(name) || qcRegex.test(name))
			runlistEntry = { ...runlistEntry, isSample: true }

		const { checkStandard, blank, referenceMaterial, duplicateSamples, isSample } = runlistEntry
		if (blank || checkStandard || referenceMaterial || duplicateSamples || isSample)
			runlist = [...runlist, runlistEntry]
	}

	return runlist
}

function simplifiedReferenceMaterial(rm: ReferenceMaterialsResponse<ExpandedReferenceMaterial>) {
	const methodElements = get(methodElementsStore)

	return {
		name: rm.name,
		elements: (rm.expand?.["referenceMaterialsRanges(referenceMaterial)"] ?? []).reduce(
			(acc, curr) => {
				const element = methodElements?.find((e) => e.elementID === curr.element)
				if (!element) return acc

				const elementID = `${element?.symbol}${element?.mass}` as ElementID
				acc[elementID] = { low: curr.lower, high: curr.upper }

				return acc
			},
			{} as Record<ElementID, ReferenceMaterialRange>
		)
	}
}

function simplifiedBlank(b: BlanksResponse<ExpandedBlank>) {
	const methodElements = get(methodElementsStore)

	return {
		name: b.name,
		elements: (b.expand?.["detectionLimits(blank)"] ?? []).reduce(
			(acc, curr) => {
				const element = methodElements?.find((e) => e.elementID === curr.element)
				if (!element) return acc

				const elementID = `${element?.symbol}${element?.mass}` as ElementID
				acc[elementID] = { mdl: curr.mdl, loq: curr.loq }

				return acc
			},
			{} as Record<ElementID, BlankLimits>
		)
	}
}

function simplifiedCheckStandard(cs: CheckStandardsResponse<ExpandedCheckStandard>) {
	const methodElements = get(methodElementsStore)

	return {
		name: cs.name,
		elements: (cs.expand?.["checkValues(checkStandard)"] ?? []).reduce(
			(acc, curr) => {
				const element = methodElements?.find((e) => e.elementID === curr.element)
				if (!element) return acc

				const elementID = `${element?.symbol}${element?.mass}` as ElementID
				acc[elementID] = { expected: curr.value }

				return acc
			},
			{} as Record<ElementID, CheckStandardValue>
		)
	}
}
