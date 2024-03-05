import { describe, expect, test } from "vitest"
import { validateCheckStandard } from "./report"

describe("Check standard", () => {
	test.each([
		// Top end
		{ result: 11.1, target: 10, limit: 0.1, passing: false, recovery: 111 },
		{ result: 11, target: 10, limit: 0.1, passing: true, recovery: 110 },

		// Mid point
		{ result: 10, target: 10, limit: 0.1, passing: true, recovery: 100 },

		// Bottom end
		{ result: 9, target: 10, limit: 0.1, passing: true, recovery: 90 },
		{ result: 8.9, target: 10, limit: 0.1, passing: false, recovery: 89 },

		// Various undefined inputs
		{ result: undefined, target: 10, limit: 0.1, passing: undefined, recovery: undefined },
		{ result: 11, target: undefined, limit: 0.1, passing: undefined, recovery: undefined },
		{ result: 11, target: 10, limit: undefined, passing: undefined, recovery: undefined }
	])(
		"returns passing: $passing and recovery: $recovery when result is $result, target is $target and limit is $limit",
		({ result, target, limit, passing, recovery }) => {
			expect(validateCheckStandard(result, target, limit)).toEqual({ passing, recovery })
		}
	)
})
