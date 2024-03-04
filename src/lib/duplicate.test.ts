import { describe, expect, it } from "vitest"
import { relativePercentDeviation, rpdPassingStatus } from "./report"

describe("Relative percent deviation", () => {
	it("is correct with two increasing values", () => {
		expect(relativePercentDeviation(10, 15)).toEqual(40)
	})

	it("is correct with two decreasing values", () => {
		expect(relativePercentDeviation(15, 10)).toEqual(40)
	})

	it("is correct with two negative values", () => {
		expect(relativePercentDeviation(-15, -10)).toEqual(40)
	})

	it("is correct with one negative value", () => {
		expect(relativePercentDeviation(15, -10)).toEqual(1000)
	})

	it("is correct with equal values", () => {
		expect(relativePercentDeviation(10, 10)).toEqual(0)
	})

	it("is correct with one zero value", () => {
		expect(relativePercentDeviation(0, 10)).toEqual(200)
	})

	it("is undefined with values that average to zero", () => {
		expect(relativePercentDeviation(-10, 10)).toBeUndefined()
	})

	it("is undefined with both zero values", () => {
		expect(relativePercentDeviation(0, 0)).toBeUndefined()
	})
})

describe("RPD passing status", () => {
	it("returns neutral when missing rpd input", () => {
		expect(rpdPassingStatus(1, undefined, 1, 1)).toEqual("neutral")
	})

	it("returns neutral when missing rpd limit", () => {
		expect(rpdPassingStatus(1, 1, undefined, 1)).toEqual("neutral")
	})

	it("returns neutral when missing rpd limit", () => {
		expect(rpdPassingStatus(1, 1, undefined, 1)).toEqual("neutral")
	})

	it("returns neutral when missing loq", () => {
		expect(rpdPassingStatus(1, 1, 1, undefined)).toEqual("neutral")
	})

	it("returns neutral when average is less than 2xLOQ", () => {
		expect(rpdPassingStatus(1, 10, 1, 1)).toEqual("neutral")
	})

	it("returns passes when rpd is below limit", () => {
		expect(rpdPassingStatus(10, 5, 1, 20)).toEqual("passes")
	})

	it("returns passes when rpd is at limit", () => {
		expect(rpdPassingStatus(10, 20, 1, 20)).toEqual("passes")
	})

	it("returns fails when rpd is above limit", () => {
		expect(rpdPassingStatus(10, 21, 1, 20)).toEqual("fails")
	})
})
