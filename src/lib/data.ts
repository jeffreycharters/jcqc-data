import Papa from "papaparse"
import type { InstrumentCSVRow, RawRunlist, ElementConcentrations } from "./types"

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
					sampleName: csvRows[i]["Sample Name"].toLowerCase().trim(),
					measurements: analytes
				}
			]

			analytes = {}
		}
	}

	return rawRunlist
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
