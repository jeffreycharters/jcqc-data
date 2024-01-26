<script lang="ts">
	import { toSigFigs } from "$lib/data"
	import { methodElementsID } from "$lib/elements"
	import { methodElementsStore } from "$lib/stores"
	import type { RunListEntry } from "../../app"
	import HeaderRow from "./HeaderRow.svelte"

	export let sample: RunListEntry
</script>

<table class="results">
	<HeaderRow firstColumnLabel="Method Blank" />

	<tbody>
		<tr class="border-b border-b-gray-400">
			<td class="firstCol">{sample.name}</td>
			{#each $methodElementsStore ?? [] as methodElement}
				<td>{toSigFigs(sample.results[methodElementsID(methodElement)])}</td>
			{/each}
		</tr>
		<tr>
			<td class="firstCol">Below LOQ</td>
			{#each $methodElementsStore ?? [] as methodElement}
				{@const loq = sample.blank?.elements[methodElementsID(methodElement)]?.loq ?? 0}
				{@const tdClass =
					loq != 0 && sample.results[methodElementsID(methodElement)]
						? sample.results[methodElementsID(methodElement)] < loq
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
