<script lang="ts">
	import { roundToSigFigs } from "$lib/data"
	import { methodStore, reportData, blanksStore, methodElementsStore } from "$lib/stores"
	import type { RunListEntry } from "../../app"
	import HeaderRow from "./HeaderRow.svelte"

	export let sample: RunListEntry
	export let duplicate: RunListEntry

	const rpdLimit = $methodStore?.rpdLimit ?? 0

	const calculateRPD = (value: number, dupValue: number) => {
		return (Math.abs(value - dupValue) / ((value + dupValue) / 2)) * 100
	}

	const checkIfDupPassing = (average: number, rpd: number, loq: number | undefined) => {
		if (!rpdLimit || !loq || average < 2 * loq) return "neutral"
		if (rpd > rpdLimit) return "fails"
		if (rpd < rpdLimit) return "passes"
	}
</script>

<table class="results relative">
	<HeaderRow firstColumnLabel="Duplicate" />

	<tbody>
		<tr class="">
			<td class="firstCol">{sample.name}</td>

			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				{#if $methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)}
					<td class="text-center">
						{roundToSigFigs(sample.results[elementID], 3)}
					</td>
				{/if}
			{/each}
		</tr>

		<tr class="border-b border-b-gray-400">
			<td class="firstCol">{sample.name} DUP</td>

			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				{#if $methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)}
					<td class="text-center">
						{roundToSigFigs(duplicate.results[elementID], 3)}
					</td>
				{/if}
			{/each}
		</tr>

		<tr class="border-b border-gray-500">
			<td>Average</td>
			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				{#if $methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)}
					<td>
						{roundToSigFigs((sample.results[elementID] + duplicate.results[elementID]) / 2, 3)}
					</td>
				{/if}
			{/each}
		</tr>

		<tr>
			<td>RPD</td>
			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				{#if $methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)}
					{@const rpd = calculateRPD(sample.results[elementID], duplicate.results[elementID])}
					{@const loq = sample.referenceBlank?.elements[elementID]?.loq}
					{@const average = (sample.results[elementID] + duplicate.results[elementID]) / 2}
					{@const passing = checkIfDupPassing(average, rpd, loq)}
					<td class={passing}>
						{#if !rpd || !loq || average < loq * 2}
							- -
						{:else}
							{parseFloat(rpd.toPrecision(2))}%
						{/if}
					</td>
				{/if}
			{/each}
		</tr>
	</tbody>
</table>
{#if ($blanksStore?.length ?? 0) > 1}
	<div class="-mt-4 w-full pb-2 pr-8 text-right text-xs italic text-stone-500">
		LOQs taken from <span class="font-bold">{sample.referenceBlank?.name ?? "unknown"}</span>. If
		this is incorrect be sure to verify RPDs.
	</div>
{/if}
