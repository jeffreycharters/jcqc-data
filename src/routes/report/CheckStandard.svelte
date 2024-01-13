<script lang="ts">
	import { roundToSigFigs } from "$lib/data"
	import HeaderRow from "./HeaderRow.svelte"
	import { methodElementsStore, methodStore, reportData } from "$lib/stores"
	import type { RunListEntry } from "../../app"

	export let sample: RunListEntry

	const checkStandardLimit = ($methodStore?.checkStandardTolerance ?? 0) / 100

	function elementPassing(elementID: string) {
		const expected = sample.checkStandard?.elements[elementID].expected ?? 0
		const value = sample.results[elementID]

		if (!expected || !value) return undefined

		const lowerLimit = expected * (1 - checkStandardLimit)
		const upperLimit = expected * (1 + checkStandardLimit)

		return value >= lowerLimit && value <= upperLimit
	}
</script>

<table class="results">
	<HeaderRow firstColumnLabel="Check Standard" />

	<tbody>
		<tr class="border-b border-b-gray-400">
			<td class="firstCol">{sample.name}</td>

			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				{@const units =
					$methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)?.units || "ppm"}
				{@const prettyValue =
					units === "ppb" ? sample.results[elementID] : sample.results[elementID] * 1000}
				<td class="text-center">
					{roundToSigFigs(prettyValue, 3)}
				</td>
			{/each}
		</tr>

		{#if checkStandardLimit}
			<tr>
				<td>Within Range</td>
				{#each $reportData?.meta.orderedElements ?? [] as elementID}
					{@const passes = elementPassing(elementID)}
					{#if passes != undefined}
						<td class={passes ? "passes" : "fails"}>
							{passes ? "Yes" : "No"}
						</td>
					{:else}
						<td>- -</td>
					{/if}
				{/each}
			</tr>
		{/if}
	</tbody>
</table>
