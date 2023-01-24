<script lang="ts">
	import { roundToSigFigs, sortedArrayFromMap } from '$lib/data';

	export let sample: RunListEntry;
	export let index: number;
	let elements = sortedArrayFromMap(sample?.results?.values);
</script>

<tr class={index % 2 === 1 ? 'bg-gray-200' : ''}>
	<td>
		{sample.name}
	</td>
	{#each elements as [_, value]}
		<td>
			{parseFloat(roundToSigFigs(value, 3))}
		</td>
	{/each}
</tr>
