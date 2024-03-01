import { describe, expect, it } from "vitest"
import { validateCheckStandard } from "./report"
import type { RunListEntry } from "../app"
import type { CheckStandard } from "./db"

const checkStandard: CheckStandard = {
	id: "checkStandard",
	name: "checkStandard",
	values: {
		element: 10
	}
}

const sample: RunListEntry = {
	name: "sample",
	analysisNumber: 1,
	checkStandard,
	results: {}
}

describe("Check Standard", () => {
	it("fails when above upper limit", () => {
		const highSample = { ...sample, results: { element: 11.1 } }

		expect(validateCheckStandard(highSample, "element", 0.1)).toEqual({
			passing: false,
			recovery: 111
		})
	})

	it("passes when at upper limit", () => {
		const highSample = { ...sample, results: { element: 11.0 } }

		expect(validateCheckStandard(highSample, "element", 0.1)).toEqual({
			passing: true,
			recovery: 110
		})
	})

	it("passes when at lower limit", () => {
		const highSample = { ...sample, results: { element: 9 } }

		expect(validateCheckStandard(highSample, "element", 0.1)).toEqual({
			passing: true,
			recovery: 90
		})
	})

	it("fails when below lower limit", () => {
		const highSample = { ...sample, results: { element: 8.9 } }

		expect(validateCheckStandard(highSample, "element", 0.1)).toEqual({
			passing: false,
			recovery: 89
		})
	})
})
