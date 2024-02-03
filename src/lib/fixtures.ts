import { db } from "./db"

export async function addSomeMethods() {
	db.methods.bulkAdd([
		{
			slug: "toxi-064",
			name: "TOXI-064",
			description: "Food and stuff",
			active: true,
			rpdLimit: 20,
			calibrationCount: 10,
			checkStandardTolerance: 15,
			reportSigFigs: 3
		},
		{
			slug: "chem-162",
			name: "CHEM-162",
			description: "serums and stuff",
			active: true,
			rpdLimit: 20,
			calibrationCount: 10,
			checkStandardTolerance: 15,
			reportSigFigs: 3
		}
	])
}

export async function addSomeElements() {
	db.elements.bulkAdd([
		{
			id: "Mn55",
			symbol: "Mn",
			mass: 55,
			active: true
		},
		{
			id: "Cr52",
			symbol: "Cr",
			mass: 52,
			active: true
		}
	])
}
