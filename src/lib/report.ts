import type { RunListEntry } from "../app"

export function validateCheckStandard(sample: RunListEntry, elementID: string, limit: number) {
	const expected = sample.checkStandard?.values[elementID]
	const value = sample.results[elementID]

	if (!expected || !value) return { passing: undefined, recovery: undefined }

	const lowerThreshold = expected * (1 - limit)
	const upperThreshold = expected * (1 + limit)

	return {
		passing: value >= lowerThreshold && value <= upperThreshold,
		recovery: Math.round((value / expected) * 100)
	}
}
