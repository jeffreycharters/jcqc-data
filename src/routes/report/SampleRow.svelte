<script lang="ts">
	import { roundToSigFigs, sortedArrayFromMap } from '$lib/data';

	export let sample: RunListEntry;
	let elements = sortedArrayFromMap(sample?.results?.values);
</script>

<tr>
	<td>
		{sample.name}
	</td>
	{#each elements as [mass, value]}
		<td>
			{parseFloat(roundToSigFigs(value, 3))}
		</td>
	{/each}
</tr>
