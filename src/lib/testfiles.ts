import { db, type Blank, type Method, type MethodElement } from "./db"
import type { InstrumentCSVRow } from "./types"

export async function methodTestOutput(methodID: string) {
	let method = await db.methods.get(methodID)
	if (!method) throw new Error("Method not found")

	console.log(method)

	const methodElements = await db.methodElements.where("method").equals(methodID).toArray()
	const usedElements = methodElements.map((me) => me.element)

	const elements = await db.elements.where("id").anyOf(usedElements).toArray()

	const blanks = await db.blanks.where("method").equals(methodID).toArray()
	const checkStandards = await db.checkStandards.where("method").equals(methodID).toArray()
	const referenceMaterials = await db.referenceMaterials.where("method").equals(methodID).toArray()

	method = { ...method, elements, blanks, checkStandards, referenceMaterials }

	const headerRow =
		"Sample Name,Dilution Factor,Sample Weight or Volume,Analyte,Mass,Concentration,Units\r\n"

	const precalRinseRow = rinseRows(method, methodElements, false)
	const calibration = calibrationRows(method, methodElements)
	const rinseRow = rinseRows(method, methodElements)
	const checkStandard = checkStandardRows(method, methodElements)
	const blank = blankRows(method, methodElements)
	const referenceMaterial = referenceMaterialsRows(method, methodElements)
	const samples = sampleRows(method)

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

	console.log(output)

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

export function calibrationRows(method: Method, methodElements: MethodElement[]) {
	let output: string = ""

	for (let i = 0; i <= method?.calibrationCount; i++) {
		for (const element of method.elements ?? []) {
			const methodElement = methodElements.find((me) => me.element === element.id)
			const sampleName = calibrationSampleName(i, method.calibrationCount)
			const row: InstrumentCSVRow = {
				"Sample Name": sampleName,
				"Dilution Factor": 1,
				"Sample Weight or Volume": 1,
				Analyte: element.symbol,
				Mass: element.mass,
				Units: methodElement?.units ?? "ppm",
				Concentration: (methodElement?.units ?? "ppm") === "ppb" ? i * 10 : i / 100
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

export function rinseRows(method: Method, methodElements: MethodElement[], calibrated = true) {
	let output: string = ""

	for (const element of method?.elements ?? []) {
		const methodElement = methodElements.find((me) => me.element === element.id)
		const row: InstrumentCSVRow = {
			"Sample Name": "rinse",
			"Dilution Factor": 1,
			"Sample Weight or Volume": 1,
			Analyte: element.symbol,
			Mass: element.mass,
			Units: methodElement?.units ?? "ppm"
		}
		if (calibrated) row.Concentration = Math.random() * 10
		output = output + SpreadCSVRow(row)
	}

	return output
}

export function checkStandardRows(method: Method, methodElements: MethodElement[]) {
	if (!method.checkStandards || !method.checkStandards.length) return []

	let output: string = ""
	for (const checkStandard of method.checkStandards) {
		for (const qcType of ["tooHigh", "okHigh", "okLow", "tooLow"]) {
			for (const element of method.elements ?? []) {
				const expected = checkStandard.values[element.id]

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

				const methodElement = methodElements.find((me) => me.element === element.id)
				const row: InstrumentCSVRow = {
					"Sample Name": checkStandard.name,
					"Dilution Factor": 1,
					"Sample Weight or Volume": 1,
					Analyte: element.symbol,
					Mass: element.mass,
					Units: methodElement?.units ?? "ppm",
					Concentration: concentration
				}

				output = output + SpreadCSVRow(row)
			}
		}
	}

	return output
}

export function blankRows(
	method: Method,
	methodElements: MethodElement[],
	includeDuplicates = true
) {
	if (!method.blanks || !method.blanks.length) return []

	let output: string = ""

	for (let i = 0; i < method.blanks.length; i++) {
		for (const qcType of ["tooHigh", "ok"]) {
			for (const element of method.elements ?? []) {
				const loq = method.blanks[i].loqs[element.id]

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

				const methodElement = methodElements.find((me) => me.element === element.id)

				const row: InstrumentCSVRow = {
					"Sample Name": method.blanks[i].name,
					"Dilution Factor": 1,
					"Sample Weight or Volume": 1,
					Analyte: element.symbol,
					Mass: element.mass,
					Units: methodElement?.units ?? "ppm",
					Concentration: concentration
				}

				output = output + SpreadCSVRow(row)
			}
		}

		if (includeDuplicates)
			output = output + duplicateRows(method, methodElements, method.rpdLimit, method.blanks[i])
	}

	return output
}

function duplicateRows(
	method: Method,
	methodElements: MethodElement[],
	target: number,
	blank: Blank
) {
	let output: string = ""

	const qcTypes = ["unacceptable", "acceptable", "noDetect"]

	for (let i = 0; i < qcTypes.length; i++) {
		for (const rep of [0, 1]) {
			for (const element of method.elements ?? []) {
				const loq = blank.loqs[element.id]

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

				const methodElement = methodElements.find((me) => me.element === element.id)

				const row: InstrumentCSVRow = {
					"Sample Name": "20-00000" + i + "-0001" + (rep === 1 ? " Dup" : ""),
					"Dilution Factor": 1,
					"Sample Weight or Volume": 1,
					Analyte: element.symbol,
					Mass: element.mass,
					Units: methodElement?.units ?? "ppm",
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

export function referenceMaterialsRows(method: Method, methodElements: MethodElement[]) {
	if (!method.referenceMaterials || !method.referenceMaterials.length) return []

	let output: string = ""

	for (const referenceMaterial of method.referenceMaterials) {
		for (const qcType of ["tooHigh", "okHigh", "okLow", "tooLow"]) {
			for (const element of method.elements ?? []) {
				const lower = referenceMaterial.lower[element.id]
				const upper = referenceMaterial.upper[element.id]

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

				const methodElement = methodElements.find((me) => me.element === element.id)

				const row: InstrumentCSVRow = {
					"Sample Name": referenceMaterial.name,
					"Dilution Factor": 1,
					"Sample Weight or Volume": 1,
					Analyte: element.symbol,
					Mass: element.mass,
					Units: methodElement?.units ?? "ppm",
					Concentration: concentration
				}

				output = output + SpreadCSVRow(row)
			}
		}
	}

	return output
}

export function sampleRows(method: Method) {
	let output: string = ""
	for (let i = 1; i < 10; i++) {
		for (const element of method.elements ?? []) {
			const row = SpreadCSVRow({
				"Sample Name": `20-00000${i}-000${i}`,
				"Dilution Factor": 1,
				"Sample Weight or Volume": 1,
				Analyte: element.symbol,
				Mass: element.mass,
				Units: "ppb",
				Concentration: i
			})
			output = output + row
		}
	}

	return output
}
