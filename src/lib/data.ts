import Papa from "papaparse"
import type { InstrumentCSVRow, RawRunlist, ElementConcentrations } from "./types"
import type { RunListEntry } from "../app"
import { get } from "svelte/store"
import type { Blank, Method } from "./db"
import { getMethodContext } from "./storage"
import { browser } from "$app/environment"

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
	const elementMap: Record<string, boolean> = {}

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
	let runlist: RunListEntry[] = []

	if (!browser) return runlist

	const savedMethod = localStorage.getItem("fullMethod")
	if (!savedMethod) return runlist

	const method = JSON.parse(savedMethod) as Method | undefined

	const checkStandardNames = method?.checkStandards?.map((c) => c.name.trim().toLowerCase()) ?? []
	const blankNames = method?.blanks?.map((b) => b.name.trim().toLowerCase()) ?? []
	const referenceMaterialNames =
		method?.referenceMaterials?.filter((rm) => rm.active).map((r) => r.name.trim().toLowerCase()) ??
		[]

	let mostRecentBlank: Blank | undefined

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
			const cs = method?.checkStandards?.find((c) => c.name.toLowerCase() === name)
			if (cs) runlistEntry = { ...runlistEntry, checkStandard: cs }
		}

		if (blankNames.includes(name)) {
			const blk = method?.blanks?.find((b) => b.name.toLowerCase() === name)
			if (blk) {
				runlistEntry = { ...runlistEntry, blank: blk }
				mostRecentBlank = blk
			}
		}

		if (referenceMaterialNames.includes(name)) {
			const rm = method?.referenceMaterials?.find((r) => r.name.toLowerCase() === name)
			if (rm) runlistEntry = { ...runlistEntry, referenceMaterial: rm }
		}

		if (sampleRegex.test(name) || qcRegex.test(name))
			runlistEntry = { ...runlistEntry, isSample: true }

		const { checkStandard, blank, referenceMaterial, duplicateSamples, isSample } = runlistEntry
		if (blank || checkStandard || referenceMaterial || duplicateSamples || isSample)
			runlist = [...runlist, runlistEntry]
	}

	return runlist
}

export function toSigFigs(
	n: number,
	sigFigs: number = get(getMethodContext())?.reportSigFigs ?? 2
) {
	let orderOfMagnitude = 0

	for (let number = n; number > 10; number /= 10) {
		orderOfMagnitude += 1
	}

	if (sigFigs > orderOfMagnitude) return n.toPrecision(sigFigs)

	return parseFloat(n.toPrecision(sigFigs)).toString()
}
