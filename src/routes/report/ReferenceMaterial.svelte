<script lang="ts">
	import { toSigFigs } from "$lib/data"
	import { methodElementsID } from "$lib/elements"
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

	const conditionalSpace = ($methodElementsStore?.length ?? 0) > 11 ? "" : " "
</script>

<table class="results">
	<HeaderRow firstColumnLabel="Reference Material" />

	<tbody>
		<tr class="border-b border-b-gray-400">
			<td class="firstCol">{sample.name}</td>
			{#each $methodElementsStore ?? [] as methodElement}
				{#if $methodElementsStore?.find((e) => e.mass === methodElement.mass)}
					<td>{toSigFigs(sample.results[methodElementsID(methodElement)])}</td>
				{/if}
			{/each}
		</tr>
		<tr>
			<td class="firstCol">Within Range</td>

			{#each $methodElementsStore ?? [] as methodElement}
				{#if $methodElementsStore?.find((e) => e.mass === methodElement.mass)}
					{@const ranges = sample.referenceMaterial?.elements[methodElementsID(methodElement)]}
					{@const passes = ranges
						? checkRanges(sample.results[methodElementsID(methodElement)], ranges)
						: "neutral"}

					<td class="{passes} whitespace-nowrap">
						{#if passes === "neutral"}
							- -
						{:else if passes === "passes"}
							Yes
						{:else if ranges}
							{sample.results[methodElementsID(methodElement)] > ranges.high
								? `>${conditionalSpace}${ranges.high}`
								: `<${conditionalSpace}${ranges.low}`}
						{/if}
					</td>
				{/if}
			{/each}
		</tr>
	</tbody>
</table>
