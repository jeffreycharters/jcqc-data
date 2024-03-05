import { describe, expect, test } from "vitest"
import { referenceMaterialPassingStatus } from "./report"

describe("Reference Material", () => {
	test.each([
		// Both low and high thresholds
		{ result: 11, ranges: { high: 10, low: 5 }, expected: "fails" },
		{ result: 10, ranges: { high: 10, low: 5 }, expected: "passes" },
		{ result: 7, ranges: { high: 10, low: 5 }, expected: "passes" },
		{ result: 5, ranges: { high: 10, low: 5 }, expected: "passes" },
		{ result: 4, ranges: { high: 10, low: 5 }, expected: "fails" },

		// Only high threshold
		{ result: 11, ranges: { high: 10 }, expected: "fails" },
		{ result: 10, ranges: { high: 10 }, expected: "passes" },
		{ result: 7, ranges: { high: 10 }, expected: "passes" },

		// Only low threshold
		{ result: 11, ranges: { low: 10 }, expected: "passes" },
		{ result: 10, ranges: { low: 10 }, expected: "passes" },
		{ result: 7, ranges: { low: 10 }, expected: "fails" },

		// Various undefined inputs
		{ result: undefined, ranges: { high: 10, low: 5 }, expected: "neutral" },
		{ result: undefined, ranges: { high: 10 }, expected: "neutral" },
		{ result: undefined, ranges: { low: 10 }, expected: "neutral" },
		{ result: 5, ranges: undefined, expected: "neutral" },
		{ result: 5, ranges: { high: undefined, low: undefined }, expected: "neutral" }
	])(
		"returns $expected when result is $result and ranges are $ranges",
		({ result, ranges, expected }) => {
			expect(referenceMaterialPassingStatus(result, ranges)).toEqual(expected)
		}
	)
})
