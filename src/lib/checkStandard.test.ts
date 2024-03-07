import { describe, expect, test } from "vitest"
import { checkStandardPassingStatus } from "./report"

describe("Check standard", () => {
	test.each([
		// Top end
		{ result: 11.1, target: 10, limit: 0.1, inRange: "fails", recovery: 111 },
		{ result: 11, target: 10, limit: 0.1, inRange: "passes", recovery: 110 },

		// Mid point
		{ result: 10, target: 10, limit: 0.1, inRange: "passes", recovery: 100 },

		// Bottom end
		{ result: 9, target: 10, limit: 0.1, inRange: "passes", recovery: 90 },
		{ result: 8.9, target: 10, limit: 0.1, inRange: "fails", recovery: 89 },

		// Various undefined inputs
		{ result: undefined, target: 10, limit: 0.1, inRange: "neutral", recovery: undefined },
		{ result: 11, target: undefined, limit: 0.1, inRange: "neutral", recovery: undefined },
		{ result: 11, target: 10, limit: undefined, inRange: "neutral", recovery: undefined }
	])(
		"returns inRange: $inRange and recovery: $recovery when result is $result, target is $target and limit is $limit",
		({ result, target, limit, inRange, recovery }) => {
			expect(checkStandardPassingStatus(result, target, limit)).toEqual({ inRange, recovery })
		}
	)
})
