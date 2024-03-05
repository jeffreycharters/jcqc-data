export function validateCheckStandard(
	result: number | undefined,
	target: number | undefined,
	limit: number | undefined
) {
	if (result === undefined || target === undefined || limit === undefined)
		return { passing: undefined, recovery: undefined }

	const lowerThreshold = target * (1 - limit)
	const upperThreshold = target * (1 + limit)

	return {
		passing: result >= lowerThreshold && result <= upperThreshold,
		recovery: Math.round((result / target) * 100)
	}
}

export function relativePercentDeviation(value: number, dupValue: number) {
	const absoluteDifference = value > dupValue ? value - dupValue : dupValue - value
	const average = (value + dupValue) / 2

	if (average === 0) return undefined

	return Math.abs((absoluteDifference / average) * 100)
}

type StatusString = "passes" | "fails" | "neutral"

export function rpdPassingStatus(
	average: unknown,
	rpd: number | undefined,
	loq: number | undefined,
	rpdLimit: number | undefined
): StatusString {
	if (isNaN(average as number)) return "neutral"

	const averageNumber = average as number
	if (rpd === undefined || !rpdLimit || !loq || averageNumber < 2 * loq) return "neutral"

	return rpd <= rpdLimit ? "passes" : "fails"
}

export function blankPassingStatus(
	result: number | undefined,
	loq: number | undefined
): StatusString {
	if (result === undefined || !loq) return "neutral"

	if (result <= loq) return "passes"

	return "fails"
}

export function referenceMaterialPassingStatus(
	result: number | undefined,
	ranges: ReferenceMaterialRange | undefined
): StatusString {
	if (!result || !ranges || (!ranges.high && !ranges.low)) return "neutral"

	let { low, high } = ranges

	if (low === undefined) low = -Infinity
	if (high == undefined) high = Infinity

	return result >= low && result <= high ? "passes" : "fails"
}
