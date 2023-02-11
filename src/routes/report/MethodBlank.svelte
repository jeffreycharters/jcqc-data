<script lang="ts">
	import { roundToSigFigs, sortedArrayFromMap } from '$lib/data';
	import { method } from '$lib/stores';
	import HeaderRow from './HeaderRow.svelte';

	export let sample: RunListEntry;

	let values = sortedArrayFromMap(sample.results.values);

	let methodBlanks = [...($method?.blanks?.values() ?? [])];
	let methodBlank = methodBlanks.find((b) => b.name.toLowerCase() === sample.name.toLowerCase());
</script>

<div>
	<br />
	<table class="results mb-4">
		<HeaderRow firstColumnLabel="Method Blank" />

		<tbody>
			<tr class="border-b border-b-gray-400">
				<td class="firstCol">{sample.name}</td>
				{#each [...values] as [key, value]}
					<td>{roundToSigFigs(value, 3)}</td>
				{/each}
			</tr>
			<tr>
				<td class="firstCol">Below LOQ</td>
				{#each [...values] as [key, value]}
					{@const loq =
						$method?.getValue(
							'blanks',
							methodBlank?.name ?? '',
							'detectionLimits',
							$method.getElementIdFromMass(key) ?? ''
						).loq ?? 0}
					{@const tdClass = loq != 0 && value ? (value < loq ? 'passes' : 'fails') : 'neutral'}
					<td class={tdClass}>
						{loq != 0 ? loq : '- -'}
					</td>
				{/each}
			</tr>
		</tbody>
	</table>
</div>
