<script lang="ts">
	import { roundToSigFigs, sortedArrayFromMap } from '$lib/data';
	import HeaderRow from './HeaderRow.svelte';
	import { method } from '$lib/stores';

	export let sample: RunListEntry;
	let values = sortedArrayFromMap(sample.results.values);
	$: checkStandardLimit = 100; // TODO fix this
</script>

<div>
	<br />
	<table class="results">
		<HeaderRow firstColumnLabel="Check Standard" />

		<tbody>
			<tr class="border-b border-b-gray-400">
				<td class="firstCol">{sample.name}</td>

				{#each values as [_, value]}
					{@const prettifiedValue = value < 2 ? value * 1000 : value}
					<td class="text-center">
						{roundToSigFigs(prettifiedValue, 3)}
					</td>
				{/each}
			</tr>

			{#if checkStandardLimit}
				<tr>
					<td>Within Range</td>
					{#each values as [key, value]}
						{@const prettifiedValue = value < 1 ? value * 1000 : value}
						{@const elementExpected =
							$method?.elements?.find((element) => element.mass === key)?.mass ?? 0};
						{@const tolerance = elementExpected * checkStandardLimit}
						{@const passes =
							prettifiedValue < elementExpected + tolerance &&
							prettifiedValue > elementExpected - tolerance}
						<td class={passes ? 'passes' : 'fails'}>
							{passes ? 'Yes' : 'No'}
						</td>
					{/each}
				</tr>
			{/if}
		</tbody>
	</table>
	<br />
</div>
