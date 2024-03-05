import { describe, expect, test } from "vitest"
import { blankPassingStatus } from "./report"

describe("Method Blank", () => {
	test.each([
		{ result: 1, loq: 10, expected: "passes" },
		{ result: 10, loq: 10, expected: "passes" },
		{ result: 10.1, loq: 10, expected: "fails" },

		{ result: undefined, loq: 10, expected: "neutral" },
		{ result: 1, loq: undefined, expected: "neutral" },
		{ result: undefined, loq: undefined, expected: "neutral" }
	])("returns $expected when result is $result and LOQ is $loq", ({ result, loq, expected }) => {
		expect(blankPassingStatus(result, loq)).toEqual(expected)
	})
})
