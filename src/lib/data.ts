import Papa from "papaparse"
import type { RunListEntry } from "../app"

export const parseFileAndUpdateStore = async (inputFile: File) => {
	const inputString = await inputFile.text()
	const data = Papa.parse(inputString, {
		header: true,
		dynamicTyping: true
	})

	console.log(data.data[0])
	const runList: RunListEntry[] = []
	return {
		runList,
		elementCount: 0
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
