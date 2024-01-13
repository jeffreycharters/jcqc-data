<script lang="ts">
	import { roundToSigFigs } from "$lib/data"
	import { methodStore, reportData } from "$lib/stores"
	import type { RunListEntry } from "../../app"
	import HeaderRow from "./HeaderRow.svelte"

	export let sample: RunListEntry
	export let duplicate: RunListEntry

	const rpdLimit = $methodStore?.rpdLimit ?? 0

	const calculateRPD = (value: number, dupValue: number) => {
		return (Math.abs(value - dupValue) / (value + dupValue / 2)) * 100
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
				<td class="text-center">
					{roundToSigFigs(sample.results[elementID], 3)}
				</td>
			{/each}
		</tr>

		<tr class="border-b border-b-gray-400">
			<td class="firstCol">{sample.name} DUP</td>

			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				<td class="text-center">
					{roundToSigFigs(duplicate.results[elementID], 3)}
				</td>
			{/each}
		</tr>

		<tr class="border-b border-gray-500">
			<td>Average</td>
			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				<td>
					{roundToSigFigs((sample.results[elementID] + duplicate.results[elementID]) / 2, 3)}
				</td>
			{/each}
		</tr>

		<tr>
			<td>RPD (%)</td>
			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				{@const rpd = calculateRPD(sample.results[elementID], duplicate.results[elementID])}
				{@const loq = sample.referenceBlank?.elements[elementID]?.mdl}
				{@const average = (sample.results[elementID] + duplicate.results[elementID]) / 2}
				{@const passing = checkIfDupPassing(average, rpd, loq)}
				<td class={passing}>
					{#if !rpd || !loq || average < loq * 2}
						{rpd?.toFixed(1) ?? "- -"}
					{:else}
						{parseFloat(rpd.toPrecision(2))}
					{/if}
				</td>
			{/each}
		</tr>
	</tbody>
</table>
<div class="w-full text-right pr-8 italic text-xs text-stone-500 -mt-4 pb-2">
	LOQs taken from {sample.referenceBlank?.name ?? "unknown"}. If this is incorrect be sure to verify
	RPDs.
</div>
