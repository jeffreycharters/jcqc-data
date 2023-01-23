<script lang="ts">
	import { roundToSigFigs, sortedArrayFromMap } from '$lib/data';
	import HeaderRow from './HeaderRow.svelte';

	export let samples: RunListEntry[];
</script>

<div>
	<h1>Calibration Data</h1>

	<table class="results">
		<HeaderRow firstColumnLabel="Concentration" />

		<tbody>
			{#each samples as sample (sample.id)}
				{@const values = sortedArrayFromMap(sample.results.values)}
				<tr>
					<td class="max-w-[175px] truncate text-left">{sample.name}</td>
					{#each values as [_, value]}
						<td class="text-center">{roundToSigFigs(value, 3)}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<br />

	<h1>Sample Data</h1>
</div>

<style lang="postcss">
	tr:nth-of-type(even) {
		@apply bg-gray-200;
	}
</style>
