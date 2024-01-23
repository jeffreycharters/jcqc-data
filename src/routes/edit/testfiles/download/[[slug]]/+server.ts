import { setMethodStores } from "$lib/methods.js"
import type { MethodsResponse } from "$lib/pocketbase-types.js"
import { pb } from "$lib/pocketbase.js"
import { methodStore } from "$lib/stores.js"
import {
	blankRows,
	calibrationRows,
	checkStandardRows,
	referenceMaterialsRows,
	rinseRows,
	sampleRows
} from "$lib/testfiles.js"
import type { ExpandedMethod } from "$lib/types.js"

export async function GET({ params }) {
	const method = await pb
		.collection("methods")
		.getFirstListItem<MethodsResponse<ExpandedMethod>>(`slug="${params.slug}"`, {
			expand: "elements"
		})

	methodStore.set(method)
	await setMethodStores(method.id)

	const now = new Date().toLocaleDateString("en-CA")

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

	return new Response(output, {
		headers: {
			"Content-Type": "text/plain",
			"Content-Disposition": `attachment; filename="TEST-${now}=${method.name}.txt"`
		}
	})
}
