<script lang="ts">
	import { toSigFigs } from "$lib/data"
	import { getMethodContext } from "$lib/storage"
	import type { RunListEntry } from "../../app"
	import HeaderRow from "./HeaderRow.svelte"

	export let sample: RunListEntry

	const method = getMethodContext()
</script>

<table class="results">
	<HeaderRow firstColumnLabel="Method Blank" />

	<tbody>
		<tr class="border-b border-b-gray-400">
			<td class="firstCol">{sample.name}</td>
			{#each $method?.elements ?? [] as element}
				<td>{toSigFigs(sample.results[element.id])}</td>
			{/each}
		</tr>
		<tr>
			<td class="firstCol">Below LOQ</td>
			{#each $method?.elements ?? [] as element}
				{@const loq = sample.blank?.loqs[element.id] ?? Infinity}
				{@const tdClass =
					loq != 0 && sample.results[element.id]
						? sample.results[element.id] < loq
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
