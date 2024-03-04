<script lang="ts">
	import { toSigFigs } from "$lib/data"
	import { getMethodContext, getMethodElementsContext } from "$lib/storage"
	import HeaderRow from "./HeaderRow.svelte"

	export let sample: RunListEntry

	const method = getMethodContext()
	const methodElements = getMethodElementsContext()

	type PassesString = "passes" | "fails" | "neutral"

	const checkRanges = (value: number, ranges: ReferenceMaterialRange): PassesString => {
		const { low, high } = ranges

		if ((low === 0 && high === 0) || (!low && !high)) return "neutral"
		if ((!low || low === 0) && high && value < high) return "passes"
		if ((!high || high === 0) && low && value > low) return "passes"
		if (low && high && value > low && value < high) return "passes"
		return "fails"
	}

	const conditionalSpace = ($methodElements?.length ?? 0) > 11 ? "" : " "
</script>

<table class="results">
	<HeaderRow firstColumnLabel="Reference Material" />

	<tbody>
		<tr class="border-b border-b-gray-400">
			<td class="firstCol">{sample.name}</td>
			{#each $method?.elements ?? [] as element}
				{#if $methodElements?.find((me) => me.element === element.id)}
					<td>{toSigFigs(sample.results[element.id])}</td>
				{/if}
			{/each}
		</tr>
		<tr>
			<td class="firstCol">Within Range</td>

			{#each $method?.elements ?? [] as element}
				{#if $methodElements?.find((me) => me.element === element.id)}
					{@const ranges = {
						low: sample.referenceMaterial?.lower[element.id],
						high: sample.referenceMaterial?.upper[element.id]
					}}
					{@const passes = ranges ? checkRanges(sample.results[element.id], ranges) : "neutral"}

					<td class="{passes} whitespace-nowrap">
						{#if passes === "neutral"}
							- -
						{:else if passes === "passes"}
							Yes
						{:else if ranges.low && ranges.high}
							{sample.results[element.id] > ranges?.high
								? `>${conditionalSpace}${ranges.high}`
								: `<${conditionalSpace}${ranges.low}`}
						{/if}
					</td>
				{/if}
			{/each}
		</tr>
	</tbody>
</table>
