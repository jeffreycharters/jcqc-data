type StatusString = "passes" | "fails" | "neutral"

export function checkStandardPassingStatus(
	measured: number | undefined,
	target: number | undefined,
	tolerance: number | undefined
): { inRange: StatusString; recovery: number | undefined } {
	if (measured === undefined || target === undefined || tolerance === undefined)
		return { inRange: "neutral", recovery: undefined }

	const lowerThreshold = target * (1 - tolerance)
	const upperThreshold = target * (1 + tolerance)

	return {
		inRange: measured >= lowerThreshold && measured <= upperThreshold ? "passes" : "fails",
		recovery: Math.round((measured / target) * 100)
	}
}

export function meanAverage(...values: number[]) {
	return values.reduce((acc, value) => acc + value, 0) / values.length
}

export function relativePercentDeviation(rep1: number, rep2: number) {
	const average = meanAverage(rep1, rep2)
	if (average === 0) return undefined

	const absoluteDifference = Math.abs(rep1 - rep2)

	return Math.abs((absoluteDifference / average) * 100)
}

export function duplicatePassingStatus(
	average: unknown,
	loq: number | undefined,
	rpd: number | undefined,
	rpdLimit: number | undefined
): StatusString {
	if (isNaN(average as number)) return "neutral"

	const averageNumber = average as number

	console.log(average, loq, rpd, rpdLimit)
	if (rpd === undefined || !rpdLimit || !loq || averageNumber < 2 * loq) return "neutral"

	return rpd <= rpdLimit ? "passes" : "fails"
}

export function blankPassingStatus(
	measured: number | undefined,
	loq: number | undefined
): StatusString {
	if (measured === undefined || !loq) return "neutral"

	if (measured <= loq) return "passes"

	return "fails"
}

export function referenceMaterialPassingStatus(
	measured: number | undefined,
	ranges: ReferenceMaterialRange | undefined
): StatusString {
	if (!measured || !ranges || (!ranges.high && !ranges.low)) return "neutral"

	let { low, high } = ranges

	if (low === undefined) low = -Infinity
	if (high === undefined) high = Infinity

	return measured >= low && measured <= high ? "passes" : "fails"
}
