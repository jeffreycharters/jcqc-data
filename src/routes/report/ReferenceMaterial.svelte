<script lang="ts">
	import { roundToSigFigs } from "$lib/data"
	import { methodElementsStore, reportData } from "$lib/stores"
	import type { ReferenceMaterialRange, RunListEntry } from "../../app"
	import HeaderRow from "./HeaderRow.svelte"

	export let sample: RunListEntry

	type PassesString = "passes" | "fails" | "neutral"

	const checkRanges = (value: number, ranges: ReferenceMaterialRange): PassesString => {
		const { low, high } = ranges

		if ((low === 0 && high === 0) || (!low && !high)) return "neutral"
		if ((!low || low === 0) && high && value < high) return "passes"
		if ((!high || high === 0) && low && value > low) return "passes"
		if (low && high && value > low && value < high) return "passes"
		return "fails"
	}
</script>

<table class="results">
	<HeaderRow firstColumnLabel="Reference Material" />

	<tbody>
		<tr class="border-b border-b-gray-400">
			<td class="firstCol">{sample.name}</td>
			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				{#if $methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)}
					<td>
						{roundToSigFigs(sample.results[elementID], 3)}
					</td>
				{/if}
			{/each}
		</tr>
		<tr>
			<td class="firstCol">Within Range</td>

			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				{#if $methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)}
					{@const ranges = sample.referenceMaterial?.elements[elementID]}
					{@const passes = ranges ? checkRanges(sample.results[elementID], ranges) : "neutral"}

					<td class={passes}>
						{#if passes === "neutral"}
							- -
						{:else if passes === "passes"}
							Yes
						{:else if ranges}
							{sample.results[elementID] > ranges.high ? `> ${ranges.high}` : `< ${ranges.low}`}
						{/if}
					</td>
				{/if}
			{/each}
		</tr>
	</tbody>
</table>
