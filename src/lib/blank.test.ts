import { describe, expect, it } from "vitest"
import { blankPassingStatus } from "./report"

describe("Method Blank", () => {
	it("returns passes when below loq", () => {
		expect(blankPassingStatus(1, 10)).toEqual("passes")
	})

	it("returns passes when at loq", () => {
		expect(blankPassingStatus(10, 10)).toEqual("passes")
	})

	it("returns fails when above loq", () => {
		expect(blankPassingStatus(10.1, 10)).toEqual("fails")
	})

	it("returns neutral when missing loq", () => {
		expect(blankPassingStatus(1, undefined)).toEqual("neutral")
	})

	it("returns neutral when missing result", () => {
		expect(blankPassingStatus(undefined, 1)).toEqual("neutral")
	})

	it("returns neutral when both inputs missing", () => {
		expect(blankPassingStatus(undefined, undefined)).toEqual("neutral")
	})
})
