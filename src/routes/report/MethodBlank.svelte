<!-- <script lang="ts">
	import { roundToSigFigs, sortedArrayFromMap } from '$lib/data';
	import { methodParams } from '$lib/stores';
	import HeaderRow from './HeaderRow.svelte';

	export let sample: RunListEntry;
	$: loqs = $methodParams.loqs;

	let elements = sortedArrayFromMap(sample?.results?.values);
</script>

<div>
	<br />
	<table class="results">
		<HeaderRow firstColumnLabel="Method Blank" />

		<tbody>
			<tr class="border-b border-b-gray-400">
				<td class="firstCol">{sample.name}</td>
				{#each elements as elementResult}
					<td>{roundToSigFigs(elementResult[1], 3)}</td>
				{/each}
			</tr>
			<tr>
				<td class="firstCol">Below LOQ</td>
				{#each elements as element}
					{@const loq = loqs[element[0]]}
					{@const measured = element[1]}
					{@const tdClass = loq && measured ? (measured < loq ? 'passes' : 'fails') : 'neutral'}
					<td class={tdClass}>
						{loq ?? '- -'}
					</td>
				{/each}
			</tr>
		</tbody>
	</table>
</div> -->
