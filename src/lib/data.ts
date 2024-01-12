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
	RunListEntry
} from "../app"
import {
	blanksStore,
	checkStandardsStore,
	methodElementsStore,
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

export function countElements(csvRows: InstrumentCSVRow[]) {
	let elementMap: Record<string, boolean> = {}

	for (let i = 0; i < csvRows.length; i++) {
		if (elementMap[csvRows[i].Analyte]) return i

		elementMap[csvRows[i].Analyte] = true
	}

	return -1
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
					name: csvRows[i]["Sample Name"].toLowerCase().trim(),
					measurements: analytes
				}
			]

			analytes = {}
		}
	}

	return rawRunlist
}

export function parseRun(rawRunlist: RawRunlist[]) {
	let runlist: RunListEntry[] = []

	const checkStandards = get(checkStandardsStore)
	const checkStandardNames = checkStandards?.map((c) => c.name.toLowerCase()) ?? []

	const blanks = get(blanksStore)
	const blankNames = blanks?.map((b) => b.name.toLowerCase()) ?? []

	const referenceMaterials = get(referenceMaterialsStore)
	const referenceMaterialNames = referenceMaterials?.map((r) => r.name.toLowerCase()) ?? []

	listLoop: for (let i = 0; i < rawRunlist.length; i++) {
		const name = rawRunlist[i].name.trim()

		// special case
		if (name === "cal blank") {
			runlist = [
				...runlist,
				{
					name,
					analysisNumber: i,
					isCalBlank: true,
					results: {}
				}
			]
			continue
		}

		let runlistEntry: RunListEntry = {
			name,
			analysisNumber: i,
			results: rawRunlist[i].measurements
		}

		switch (true) {
			case dupRegex.test(name):
				const refSampleName = dupRegex.exec(name)?.[1]
				if (!refSampleName) break

				for (let j = runlist.length - 1; j >= 0; j--) {
					if (runlist[j].name === refSampleName) {
						const duplicateSamples = runlist[j].duplicateSamples ?? []
						runlist[j] = { ...runlist[j], duplicateSamples: [...duplicateSamples, runlistEntry] }
						continue listLoop
					}
				}
				break
			case checkStandardNames.includes(name):
				const cs = checkStandards?.find((c) => c.name.toLowerCase() === name)
				if (cs) runlistEntry = { ...runlistEntry, checkStandard: simplifiedCheckStandard(cs) }

			case blankNames.includes(name):
				const blank = blanks?.find((b) => b.name.toLowerCase() === name)
				if (blank) runlistEntry = { ...runlistEntry, blank: simplifiedBlank(blank) }

			case referenceMaterialNames.includes(name):
				const rm = referenceMaterials?.find((r) => r.name.toLowerCase() === name)
				if (rm)
					runlistEntry = { ...runlistEntry, referenceMaterial: simplifiedReferenceMaterial(rm) }
		}

		const normalSample = sampleRegex.test(name) || qcRegex.test(name)
		const { checkStandard, blank, referenceMaterial, duplicateSamples } = runlistEntry

		if (blank || checkStandard || referenceMaterial || duplicateSamples || normalSample)
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

// export const roundToSigFigs = (number: number, sigFigs: number) => {
// 	let orderOfMagnitude = 0
// 	let result = Number(number)

// 	if (number > 10) {
// 		while (result > 10) {
// 			result /= 10
// 			orderOfMagnitude += 1
// 		}
// 	} else if (number < 0.0001 && number > 0) {
// 		return "0.00"
// 	} else if (number < 10) {
// 		while (result < 1 && result > 0) {
// 			if (result < 0) {
// 				result = result * -1
// 			}
// 			result = result * 10
// 			orderOfMagnitude += 1
// 		}
// 	}
// 	if (number > 10) {
// 		result = number / Math.pow(10, orderOfMagnitude)
// 		result = result * Math.pow(10, sigFigs - 1)
// 		result = Math.round(result)
// 		result = result / Math.pow(10, sigFigs - orderOfMagnitude - 1)
// 		return parseFloat(result.toPrecision(sigFigs))
// 	} else if (number < 0) {
// 		result = number * Math.pow(10, sigFigs + 1)
// 		result = Math.round(result)
// 		result = result / Math.pow(10, sigFigs + 1)
// 		return parseFloat(result.toPrecision(sigFigs))
// 	} else if (number < 1) {
// 		result = number * Math.pow(10, orderOfMagnitude)
// 		result = result * Math.pow(10, sigFigs - 1)
// 		result = Math.round(result)
// 		result = result / Math.pow(10, sigFigs + orderOfMagnitude - 1)
// 		return parseFloat(result.toPrecision(sigFigs))
// 	} else {
// 		return parseFloat(number.toPrecision(sigFigs))
// 	}
// }
