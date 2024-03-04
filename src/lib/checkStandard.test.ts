import { describe, expect, test } from "vitest"
import { validateCheckStandard } from "./report"

describe("Check standard", () => {
	test.each([
		{ result: 11.1, target: 10, limit: 0.1, expected: { passing: false, recovery: 111 } },
		{ result: 11.0, target: 10, limit: 0.1, expected: { passing: true, recovery: 110 } },
		{ result: 10, target: 10, limit: 0.1, expected: { passing: true, recovery: 100 } },
		{ result: 9, target: 10, limit: 0.1, expected: { passing: true, recovery: 90 } },
		{ result: 8.9, target: 10, limit: 0.1, expected: { passing: false, recovery: 89 } },
		{
			result: undefined,
			target: 10,
			limit: 0.1,
			expected: { passing: undefined, recovery: undefined }
		},
		{
			result: 11,
			target: undefined,
			limit: 0.1,
			expected: { passing: undefined, recovery: undefined }
		},
		{
			result: 11,
			target: 10,
			limit: undefined,
			expected: { passing: undefined, recovery: undefined }
		}
	])(
		"returns $expected when result is $result, target is $target and limit is $limit",
		({ result, target, limit, expected }) => {
			expect(validateCheckStandard(result, target, limit)).toEqual(expected)
		}
	)
})
