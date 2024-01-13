<script lang="ts">
	import { roundToSigFigs } from "$lib/data"
	import type { DetectionLimitsResponse } from "$lib/pocketbase-types"
	import { methodStore, reportData } from "$lib/stores"
	import type { RunListEntry } from "../../app"
	import HeaderRow from "./HeaderRow.svelte"

	export let sample: RunListEntry
</script>

<table class="results">
	<HeaderRow firstColumnLabel="Method Blank" />

	<tbody>
		<tr class="border-b border-b-gray-400">
			<td class="firstCol">{sample.name}</td>
			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				<td>{roundToSigFigs(sample.results[elementID], 3)}</td>
			{/each}
		</tr>
		<tr>
			<td class="firstCol">Below LOQ</td>
			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				{@const loq = sample.blank?.elements[elementID]?.loq ?? 0}
				{@const tdClass =
					loq != 0 && sample.results[elementID]
						? sample.results[elementID] < loq
							? "passes"
							: "fails"
						: "neutral"}
				<td class={tdClass}>
					{loq != 0 ? loq : "- -"}
				</td>
			{/each}
		</tr>
	</tbody>
</table>
