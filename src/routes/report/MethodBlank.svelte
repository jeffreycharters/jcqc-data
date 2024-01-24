<script lang="ts">
	import { toSigFigs } from "$lib/data"
	import { methodElementsStore, reportData } from "$lib/stores"
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
				{#if $methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)}
					<td>{toSigFigs(sample.results[elementID])}</td>
				{/if}
			{/each}
		</tr>
		<tr>
			<td class="firstCol">Below LOQ</td>
			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				{#if $methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)}
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
				{/if}
			{/each}
		</tr>
	</tbody>
</table>
