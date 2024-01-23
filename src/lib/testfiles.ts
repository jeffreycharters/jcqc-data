import { get } from "svelte/store"
import {
	blanksStore,
	checkStandardsStore,
	methodElementsStore,
	methodStore,
	referenceMaterialsStore
} from "./stores"
import type { ExpandedBlank, ExpandedMethod, InstrumentCSVRow, MethodElement } from "./types"
import type { BlanksResponse, MethodsResponse } from "./pocketbase-types"
import { pb } from "./pocketbase"
import { setMethodStores } from "./methods"

export async function methodTestOutput(methodID: string) {
	const method = await pb.collection("methods").getOne<MethodsResponse<ExpandedMethod>>(methodID, {
		expand: "elements"
	})

	methodStore.set(method)
	await setMethodStores(method.id)

	const headerRow =
		"Sample Name,Dilution Factor,Sample Weight or Volume,Analyte,Mass,Concentration,Units\r\n"

	const precalRinseRow = rinseRows(false)
	const rinseRow = rinseRows(true)
	const calibration = calibrationRows()
	const checkStandard = checkStandardRows()
	const blank = blankRows()
	const referenceMaterial = referenceMaterialsRows()
	const samples = sampleRows()

	const output =
		headerRow +
		precalRinseRow +
		calibration +
		rinseRow +
		rinseRow +
		checkStandard +
		blank +
		referenceMaterial +
		rinseRow +
		samples +
		rinseRow

	return output
}

export function SpreadCSVRow(input: InstrumentCSVRow) {
	const order: Array<keyof InstrumentCSVRow> = [
		"Sample Name",
		"Dilution Factor",
		"Sample Weight or Volume",
		"Analyte",
		"Mass",
		"Concentration",
		"Units"
	]

	let output: (string | number)[] = []

	for (const item of order) {
		output = [...output, input[item] ?? ""]
	}

	return output
		.map((s) => (typeof s === "number" ? s.toFixed(5) : s))
		.join(",")
		.concat("\r\n")
}

export function calibrationRows() {
	const method = get(methodStore)
	const methodElements = get(methodElementsStore)?.sort((a, b) => a.mass - b.mass)

	if (!method || !methodElements) throw new Error("Missing method or method elements")

	let output: string = ""

	for (let i = 0; i <= method?.calibrationCount; i++) {
		for (const methodElement of methodElements) {
			const sampleName = calibrationSampleName(i, method.calibrationCount)
			const row: InstrumentCSVRow = {
				"Sample Name": sampleName,
				"Dilution Factor": 1,
				"Sample Weight or Volume": 1,
				Analyte: methodElement.symbol,
				Mass: methodElement.mass,
				Units: methodElement.units,
				Concentration: methodElement.units === "ppb" ? i * 10 : i / 100
			}

			output = output + SpreadCSVRow(row)
		}
	}

	return output
}

export function calibrationSampleName(i: number, calibrationCount: number) {
	if (i === 0) return "Cal Blank"

	if (i < calibrationCount) return `Cal Standard ${i}`

	if (i === calibrationCount) return "Highest Standard"

	if (i > calibrationCount + 1) return "Error! Should not be visible"

	return "Unknown Cal Sample"
}

export function rinseRows(calibrated = true) {
	const method = get(methodStore)
	const methodElements = get(methodElementsStore)?.sort((a, b) => a.mass - b.mass)

	if (!method || !methodElements) throw new Error("Missing method or method elements")

	let output: string = ""

	for (const methodElement of methodElements) {
		const row: InstrumentCSVRow = {
			"Sample Name": "rinse",
			"Dilution Factor": 1,
			"Sample Weight or Volume": 1,
			Analyte: methodElement.symbol,
			Mass: methodElement.mass,
			Units: methodElement.units
		}
		if (calibrated) row.Concentration = Math.random() * 10
		output = output + SpreadCSVRow(row)
	}

	return output
}

export function checkStandardRows() {
	const method = get(methodStore)
	const methodElements = get(methodElementsStore)?.sort((a, b) => a.mass - b.mass)
	const checkStandards = get(checkStandardsStore)

	if (!method || !methodElements) throw new Error("Missing method or method elements")

	if (!checkStandards || !checkStandards.length) return []

	let output: string = ""
	for (const checkStandard of checkStandards) {
		for (const qcType of ["tooHigh", "okHigh", "okLow", "tooLow"]) {
			for (const methodElement of methodElements) {
				const expected =
					checkStandard.expand?.["checkValues(checkStandard)"]?.find(
						(c) => c.element === methodElement.elementID
					)?.value ?? 0

				let concentration = 0

				switch (qcType) {
					case "tooHigh":
						concentration = expected * (1 + method.checkStandardTolerance / 100) * 1.01
						break
					case "okHigh":
						concentration = (expected * (1 + method.checkStandardTolerance / 100)) / 1.01
						break
					case "okLow":
						concentration = expected * (1 - method.checkStandardTolerance / 100) * 1.01
						break
					case "tooLow":
						concentration = (expected * (1 - method.checkStandardTolerance / 100)) / 1.01
						break
					default:
						throw new Error("Invalid qcType")
				}

				const row: InstrumentCSVRow = {
					"Sample Name": checkStandard.name,
					"Dilution Factor": 1,
					"Sample Weight or Volume": 1,
					Analyte: methodElement.symbol,
					Mass: methodElement.mass,
					Units: methodElement.units,
					Concentration: concentration
				}

				output = output + SpreadCSVRow(row)
			}
		}
	}

	return output
}

export function blankRows(includeDuplicates = true) {
	const method = get(methodStore)
	const methodElements = get(methodElementsStore)?.sort((a, b) => a.mass - b.mass)
	const blanks = get(blanksStore)

	if (!method || !methodElements) throw new Error("Missing method or method elements")

	if (!blanks || !blanks.length) return []

	let output: string = ""

	for (let i = 0; i < blanks.length; i++) {
		for (const qcType of ["tooHigh", "ok"]) {
			for (const methodElement of methodElements) {
				const loq =
					blanks[i].expand?.["detectionLimits(blank)"].find(
						(c) => c.element === methodElement.elementID
					)?.loq ?? 0

				let concentration = 0

				switch (qcType) {
					case "tooHigh":
						concentration = loq * 1.05
						break
					case "ok":
						concentration = loq / 1.05
						break
					default:
						throw new Error("Invalid qcType")
				}

				const row: InstrumentCSVRow = {
					"Sample Name": blanks[i].name,
					"Dilution Factor": 1,
					"Sample Weight or Volume": 1,
					Analyte: methodElement.symbol,
					Mass: methodElement.mass,
					Units: methodElement.units,
					Concentration: concentration
				}

				output = output + SpreadCSVRow(row)
			}
		}

		if (includeDuplicates)
			output = output + duplicateRows(method.rpdLimit, blanks[i], methodElements)
	}

	return output
}

function duplicateRows(
	target: number,
	blank: BlanksResponse<ExpandedBlank>,
	methodElements: MethodElement[]
) {
	let output: string = ""

	const qcTypes = ["unacceptable", "acceptable", "noDetect"]

	for (let i = 0; i < qcTypes.length; i++) {
		for (const rep of [0, 1]) {
			for (const methodElement of methodElements) {
				const loq =
					blank.expand?.["detectionLimits(blank)"].find(
						(c) => c.element === methodElement.elementID
					)?.loq ?? 0

				let dups: [number, number]

				switch (qcTypes[i]) {
					case "unacceptable":
						dups = twoDuplicates(loq * 3, target * 1.1)
						break
					case "acceptable":
						dups = twoDuplicates(loq * 3, target * 0.9)
						break
					case "noDetect":
						dups = twoDuplicates(loq * 1.9, target * 1.2)
						break
					default:
						dups = [0, 0]
				}

				const row: InstrumentCSVRow = {
					"Sample Name": "20-00000" + i + "-0001" + (rep === 1 ? " Dup" : ""),
					"Dilution Factor": 1,
					"Sample Weight or Volume": 1,
					Analyte: methodElement.symbol,
					Mass: methodElement.mass,
					Units: methodElement.units,
					Concentration: dups[rep]
				}

				output = output + SpreadCSVRow(row)
			}
		}
	}
	return output
}

function twoDuplicates(xBar: number, rpdTarget: number): [number, number] {
	const x1 = xBar * 0.9
	const x2 = (rpdTarget / 100) * xBar + x1
	return [x1, x2]
}

export function referenceMaterialsRows() {
	const method = get(methodStore)
	const methodElements = get(methodElementsStore)?.sort((a, b) => a.mass - b.mass)
	const referenceMaterials = get(referenceMaterialsStore)

	if (!method || !methodElements) throw new Error("Missing method or method elements")

	if (!referenceMaterials || !referenceMaterials.length) return []

	let output: string = ""

	for (const referenceMaterial of referenceMaterials) {
		for (const qcType of ["tooHigh", "okHigh", "okLow", "tooLow"]) {
			for (const methodElement of methodElements) {
				const { upper, lower } =
					referenceMaterial.expand?.["referenceMaterialsRanges(referenceMaterial)"].find(
						(c) => c.element === methodElement.elementID
					) ?? {}

				let concentration = 0

				switch (qcType) {
					case "tooHigh":
						concentration = (upper ?? 0) * 1.05
						break
					case "okHigh":
						concentration = (upper ?? 0) * 0.95
						break
					case "okLow":
						if (lower) concentration = lower > 0 ? lower * 1.05 : lower / 1.05
						break
					case "tooLow":
						if (lower) concentration = lower > 0 ? lower / 1.05 : lower * 1.05
						break
					default:
						throw new Error("Invalid qcType")
				}

				const row: InstrumentCSVRow = {
					"Sample Name": referenceMaterial.name,
					"Dilution Factor": 1,
					"Sample Weight or Volume": 1,
					Analyte: methodElement.symbol,
					Mass: methodElement.mass,
					Units: methodElement.units,
					Concentration: concentration
				}

				output = output + SpreadCSVRow(row)
			}
		}
	}

	return output
}

export function sampleRows() {
	const methodElements = get(methodElementsStore)?.sort((a, b) => a.mass - b.mass)
	if (!methodElements) throw new Error("Missing method elements")

	let output: string = ""
	for (let i = 1; i < 10; i++) {
		for (const methodelement of methodElements) {
			const row = SpreadCSVRow({
				"Sample Name": `20-00000${i}-000${i}`,
				"Dilution Factor": 1,
				"Sample Weight or Volume": 1,
				Analyte: methodelement.symbol,
				Mass: methodelement.mass,
				Units: "ppb",
				Concentration: i
			})
			output = output + row
		}
	}

	return output
}
