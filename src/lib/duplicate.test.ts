import { describe, expect, test } from "vitest"
import { meanAverage, relativePercentDeviation, duplicatePassingStatus } from "./report"

describe("Mean average", () => {
	test.each([
		{ result: -2, duplicate: -1, expected: -1.5 },
		{ result: -1, duplicate: -1, expected: -1 },
		{ result: -1, duplicate: 1, expected: 0 },
		{ result: 0, duplicate: 0, expected: 0 },
		{ result: 0, duplicate: 1, expected: 0.5 },
		{ result: 1, duplicate: 1, expected: 1 },
		{ result: 1, duplicate: 2, expected: 1.5 }
	])(
		"returns $expected when result is $result and duplicate is $duplicate",
		({ result, duplicate, expected }) => {
			expect(meanAverage(result, duplicate)).toEqual(expected)
		}
	)
})

describe("Relative percent deviation", () => {
	test.each([
		{ sampleResult: 10, sampleDup: 15, expected: 40 },
		{ sampleResult: 15, sampleDup: 10, expected: 40 },
		{ sampleResult: -15, sampleDup: -10, expected: 40 },
		{ sampleResult: 10, sampleDup: -15, expected: 1000 },
		{ sampleResult: -10, sampleDup: 15, expected: 1000 },
		{ sampleResult: 10, sampleDup: 10, expected: 0 },
		{ sampleResult: 0, sampleDup: 10, expected: 200 },
		{ sampleResult: 0, sampleDup: 0, expected: undefined },
		{ sampleResult: -10, sampleDup: 10, expected: undefined }
	])(
		"returns $expected when sample is $sampleResult and duplicate is $sampleDup",
		({ sampleResult, sampleDup, expected }) => {
			expect(relativePercentDeviation(sampleResult, sampleDup)).toEqual(expected)
		}
	)
})

describe("Duplicate RPD passing status", () => {
	test.each([
		//
		{ average: 10, rpd: 5, loq: 1, rpdLimit: 20, expected: "passes" },
		{ average: 10, rpd: 20, loq: 1, rpdLimit: 20, expected: "passes" },
		{ average: 10, rpd: 21, loq: 1, rpdLimit: 20, expected: "fails" },

		// Result > 20% RPD and ~2x LOQ
		{ average: 10, rpd: 25, loq: 5, rpdLimit: 20, expected: "fails" },
		{ average: 10, rpd: 25, loq: 5.1, rpdLimit: 20, expected: "neutral" },
		{ average: -1, rpd: 25, loq: 5, rpdLimit: 20, expected: "neutral" },

		// Various undefined inputs
		{ average: 10, rpd: undefined, loq: 1, rpdLimit: 20, expected: "neutral" },
		{ average: 10, rpd: 20, loq: undefined, rpdLimit: 20, expected: "neutral" },
		{ average: 10, rpd: 20, loq: 1, rpdLimit: undefined, expected: "neutral" },
		{ average: undefined, rpd: 20, loq: 1, rpdLimit: 20, expected: "neutral" }
	])(
		"returns $expected with average $average, rpd $rpd, loq $loq, and rpdLimit $rpdLimit",
		({ average, loq, rpd, rpdLimit, expected }) => {
			expect(duplicatePassingStatus(average, loq, rpd, rpdLimit)).toEqual(expected)
		}
	)
})
