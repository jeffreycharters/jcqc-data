import { describe, expect, test } from "vitest"
import { relativePercentDeviation, rpdPassingStatus } from "./report"

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

describe("RPD passing status", () => {
	test.each([
		{ average: 10, rpd: 5, loq: 1, rpdLimit: 20, expected: "passes" },
		{ average: 10, rpd: 20, loq: 1, rpdLimit: 20, expected: "passes" },
		{ average: 10, rpd: 21, loq: 1, rpdLimit: 20, expected: "fails" },
		{ average: 10, rpd: 25, loq: 5, rpdLimit: 20, expected: "neutral" },
		{ average: 10, rpd: undefined, loq: 1, rpdLimit: 20, expected: "neutral" },
		{ average: 10, rpd: 20, loq: undefined, rpdLimit: 20, expected: "neutral" },
		{ average: 10, rpd: 20, loq: 1, rpdLimit: undefined, expected: "neutral" }
	])(
		"returns $expected with average $average, rpd $rpd, loq $loq, and rpdLimit $rpdLimit",
		({ average, rpd, loq, rpdLimit, expected }) => {
			expect(rpdPassingStatus(average, rpd, loq, rpdLimit)).toEqual(expected)
		}
	)
})
