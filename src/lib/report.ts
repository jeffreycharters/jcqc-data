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

export function relativePercentDeviation(value: number, dupValue: number) {
	const absoluteDifference = value > dupValue ? value - dupValue : dupValue - value
	const average = (value + dupValue) / 2

	if (average === 0) return undefined

	return Math.abs((absoluteDifference / average) * 100)
}

export function rpdPassingStatus(
	average: number,
	rpd: number | undefined,
	loq: number | undefined,
	rpdLimit: number | undefined
) {
	if (rpd === undefined || !rpdLimit || !loq || average < 2 * loq) return "neutral"

	return rpd > rpdLimit ? "fails" : "passes"
}

export function blankPassingStatus(result: number | undefined, loq: number | undefined) {
	if (result === undefined || !loq) return "neutral"

	if (result <= loq) return "passes"

	return "fails"
}
