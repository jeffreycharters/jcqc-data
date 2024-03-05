<script lang="ts">
	import { toSigFigs } from "$lib/data"
	import { blankPassingStatus } from "$lib/report"
	import { getMethodContext } from "$lib/storage"
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
				{@const loq = sample.blank?.loqs[element.id]}
				{@const tdClass = blankPassingStatus(sample.results[element.id], loq)}
				<td class={tdClass}>
					{loq ?? "- -"}
				</td>
			{/each}
		</tr>
	</tbody>
</table>
