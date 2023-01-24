<script lang="ts">
	import { roundToSigFigs, sortedArrayFromMap } from '$lib/data';
	import { methodParams } from '$lib/stores';
	import HeaderRow from './HeaderRow.svelte';

	export let sample: RunListEntry;

	export let rm = $methodParams.referenceMaterials?.get(sample.name);
	let elements = sortedArrayFromMap(sample?.results?.values);

	type PassesString = 'passes' | 'fails' | 'neutral';

	const checkRanges = (value: number, ranges: ReferenceLimits): [PassesString, string] => {
		const { low, high } = ranges;
		if ((low === 0 && high === 0) || (!low && !high)) return ['neutral', '- -'];
		if ((!low || low === 0) && high && value < high) return ['passes', 'Yes'];
		if ((!high || high === 0) && low && value > low) return ['passes', 'Yes'];
		if (low && high && value > low && value < high) return ['passes', 'Yes'];
		return ['fails', 'No'];
	};
</script>

<div>
	<br />
	<table class="results">
		<HeaderRow firstColumnLabel="Reference Material" />

		<tbody>
			<tr class="border-b border-b-gray-400">
				<td class="firstCol">{sample.name}</td>
				{#each elements as element}
					{@const elementValue = roundToSigFigs(element[1], 3)}
					<td>
						{elementValue}
					</td>
				{/each}
			</tr>
			<tr>
				<td class="firstCol">Within Range</td>

				{#each elements as [mass, value]}
					{@const ranges = rm?.get(mass)}

					{#if ranges}
						{@const [passes, output] = checkRanges(value, ranges)}

						<td class={passes}>
							{output}
						</td>
					{/if}
				{/each}
			</tr>
		</tbody>
	</table>
	<br />
</div>
