import { get } from "svelte/store"
import { checkStandardsStore, methodElementsStore, methodStore } from "./stores"
import type { InstrumentCSVRow } from "./types"

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
	return output.map((s) => (typeof s === "number" ? s.toFixed(5) : s)).join(",") + "\r\n"
}

export function calibrationRows() {
	const method = get(methodStore)
	const methodElements = get(methodElementsStore)?.sort((a, b) => a.mass - b.mass)

	if (!method || !methodElements) throw new Error("Missing method or method elements")

	let output: string[] = []

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

			output = [...output, SpreadCSVRow(row)]
		}
	}

	return output
}

export function calibrationSampleName(i: number, calibrationCount: number) {
	if (i === 0) return "Cal Blank"

	if (i < calibrationCount) return `Cal Standard ${i}`

	if (i === calibrationCount) return "Highest Standard"

	if (i > calibrationCount + 1) return "Error! Should not be here"

	return "Unknown Cal Sample"
}

export function rinseRows(calibrated = false) {
	const method = get(methodStore)
	const methodElements = get(methodElementsStore)?.sort((a, b) => a.mass - b.mass)

	if (!method || !methodElements) throw new Error("Missing method or method elements")

	let output: string[] = []

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
		output = [...output, SpreadCSVRow(row)]
	}

	return output
}

export function checkStandardRows() {
	const method = get(methodStore)
	const methodElements = get(methodElementsStore)?.sort((a, b) => a.mass - b.mass)
	const checkStandards = get(checkStandardsStore)

	if (!method || !methodElements) throw new Error("Missing method or method elements")

	if (!checkStandards || !checkStandards.length) return []

	let output: string[] = []

	for (const checkStandard of checkStandards) {
		for (const methodElement of methodElements) {
			const expected =
				checkStandard.expand?.["checkValues(checkStandard)"]?.find(
					(c) => c.element === methodElement.elementID
				)?.value ?? 0
			const okRow: InstrumentCSVRow = {
				"Sample Name": checkStandard.name,
				"Dilution Factor": 1,
				"Sample Weight or Volume": 1,
				Analyte: methodElement.symbol,
				Mass: methodElement.mass,
				Units: methodElement.units,
				Concentration: expected
			}

			const tooLowRow: InstrumentCSVRow = {
				"Sample Name": checkStandard.name,
				"Dilution Factor": 1,
				"Sample Weight or Volume": 1,
				Analyte: methodElement.symbol,
				Mass: methodElement.mass,
				Units: methodElement.units,
				Concentration: (expected * (1 - method.checkStandardTolerance / 100)) / 1.01
			}

			const tooHighRow: InstrumentCSVRow = {
				"Sample Name": checkStandard.name,
				"Dilution Factor": 1,
				"Sample Weight or Volume": 1,
				Analyte: methodElement.symbol,
				Mass: methodElement.mass,
				Units: methodElement.units,
				Concentration: expected * (1 + method.checkStandardTolerance / 100) * 1.01
			}
			output = [...output, SpreadCSVRow(okRow), SpreadCSVRow(tooLowRow), SpreadCSVRow(tooHighRow)]
		}
	}

	return output
}
