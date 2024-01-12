<script lang="ts">
	import { roundToSigFigs } from "$lib/data"
	import type { ReferenceMaterialsRangesResponse } from "$lib/pocketbase-types"
	import { methodStore, reportData } from "$lib/stores"
	import type { ReferenceMaterialRange, RunListEntry } from "../../app"
	import HeaderRow from "./HeaderRow.svelte"

	export let sample: RunListEntry

	type PassesString = "passes" | "fails" | "neutral"

	const checkRanges = (value: number, ranges: ReferenceMaterialRange): [PassesString, string] => {
		const { low, high } = ranges

		if ((low === 0 && high === 0) || (!low && !high)) return ["neutral", "- -"]
		if ((!low || low === 0) && high && value < high) return ["passes", "Yes"]
		if ((!high || high === 0) && low && value > low) return ["passes", "Yes"]
		if (low && high && value > low && value < high) return ["passes", "Yes"]
		return ["fails", "No"]
	}
</script>

<div>
	<br />
	<table class="results">
		<HeaderRow firstColumnLabel="Reference Material" />

		<tbody>
			<tr class="border-b border-b-gray-400">
				<td class="firstCol">{sample.name}</td>
				{#each $reportData?.meta.orderedElements ?? [] as elementID}
					<td>
						{roundToSigFigs(sample.results[elementID], 3)}
					</td>
				{/each}
			</tr>
			<tr>
				<td class="firstCol">Within Range</td>

				{#each $reportData?.meta.orderedElements ?? [] as elementID}
					{@const ranges = sample.referenceMaterial?.elements[elementID]}

					{@const [passes, output] = ranges
						? checkRanges(sample.results[elementID], ranges)
						: ["neutral", "- -"]}

					<td class={passes}>
						{output}
					</td>
				{/each}
			</tr>
		</tbody>
	</table>
	<br />
</div>
