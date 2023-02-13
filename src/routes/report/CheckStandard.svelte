<script lang="ts">
	import { roundToSigFigs, sortedArrayFromMap } from '$lib/data';
	import HeaderRow from './HeaderRow.svelte';
	import { method } from '$lib/stores';
	import type { CheckStandardsResponse } from '$lib/pocketbase-types';

	export let sample: RunListEntry;
	export let checkStandard: CheckStandardsResponse | undefined;

	let values = sortedArrayFromMap(sample.results.values);
	$: checkStandardLimit = ($method?.checkStandardTolerance ?? 0) / 100;
</script>

<div>
	<table class="results">
		<HeaderRow firstColumnLabel="Check Standard" />

		<tbody>
			<tr class="border-b border-b-gray-400">
				<td class="firstCol">{sample.name}</td>

				{#each values as [_, value]}
					<td class="text-center">
						{roundToSigFigs(value, 3)}
					</td>
				{/each}
			</tr>

			{#if checkStandardLimit}
				<tr>
					<td>Within Range</td>
					{#each values as [key, value]}
						{@const elementExpected =
							$method?.getValue(
								'checkStandards',
								checkStandard?.name ?? '',
								'checkValues',
								$method.getElementIdFromMass(key) ?? ''
							)?.value ?? 0}
						{@const tolerance = elementExpected * checkStandardLimit}
						{@const passes =
							value < elementExpected + tolerance && value > elementExpected - tolerance}
						{#if elementExpected != 0}
							<td class={passes ? 'passes' : 'fails'}>
								{passes ? 'Yes' : 'No'}
							</td>
						{:else}
							<td>- -</td>
						{/if}
					{/each}
				</tr>
			{/if}
		</tbody>
	</table>
	<br />
</div>
