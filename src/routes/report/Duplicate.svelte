<script lang="ts">
	import { goto } from '$app/navigation';
	import { roundToSigFigs, sortedArrayFromMap } from '$lib/data';
	import { method } from '$lib/stores';
	import HeaderRow from './HeaderRow.svelte';

	export let sample: RunListEntry;
	let values = sortedArrayFromMap(sample?.results?.values);
	let dupValues = sortedArrayFromMap(sample?.results.dupValues ?? new Map());
	$: rpdLimit = $method?.rpdLimit ?? 0;

	if (dupValues.length === 0) goto('/');

	const calculateRPD = (value: number, dupValue: number) => {
		if (!value || !dupValue) return undefined;
		return (Math.abs(value - dupValue) / (value + dupValue / 2)) * 100;
	};

	const checkIfDupPassing = (average: number, rpd: number | undefined, loq: number | undefined) => {
		if (!rpd || !loq || !rpdLimit || average < 2 * loq) return 'neutral';
		if (rpd > rpdLimit) return 'fails';
		if (rpd < rpdLimit) return 'passes';
	};
</script>

<div>
	<table class="results">
		<HeaderRow firstColumnLabel="Duplicate" />

		<tbody>
			<tr class="">
				<td class="firstCol">{sample.name}</td>

				{#each values as [_, value]}
					<td class="text-center">
						{roundToSigFigs(value, 3)}
					</td>
				{/each}
			</tr>

			<tr class="border-b border-b-gray-400">
				<td class="firstCol">{sample.name} DUP</td>

				{#each dupValues as [_, dupValue]}
					<td class="text-center">
						{roundToSigFigs(dupValue, 3)}
					</td>
				{/each}
			</tr>

			{#if values}
				<tr class="border-b border-gray-500">
					<td>Average</td>
					{#each values as [_, value], index}
						<td>
							{roundToSigFigs((value + dupValues[index][1]) / 2, 3)}
						</td>
					{/each}
				</tr>

				<tr>
					<td>RPD (%)</td>
					{#each values as [mass, value], index}
						{@const rpd = calculateRPD(value, dupValues[index][1])}
						{@const loq = $method?.getValue(
							'blanks',
							[...($method.blanks?.values() ?? [])][0].name,
							'detectionLimits',
							$method?.getElementIdFromMass(mass) ?? ''
						)}
						{@const average = (value + dupValues[index][1]) / 2}
						{@const passing = checkIfDupPassing(average, rpd, loq)}
						<td class={passing}>
							{#if !rpd || !loq || average < loq * 2}
								{rpd?.toFixed(1) ?? '- -'}
							{:else}
								{parseFloat(rpd.toPrecision(2))}
							{/if}
						</td>
					{/each}
				</tr>
			{/if}
		</tbody>
	</table>
	<br />
</div>
