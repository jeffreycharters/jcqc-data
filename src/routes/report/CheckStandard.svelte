<script lang="ts">
	import HeaderRow from "./HeaderRow.svelte"
	import { methodElementsStore, methodStore, reportData } from "$lib/stores"
	import type { RunListEntry } from "../../app"

	export let sample: RunListEntry

	const checkStandardLimit = ($methodStore?.checkStandardTolerance ?? 0) / 100

	function elementPassing(elementID: string) {
		const expected = sample.checkStandard?.elements[elementID]?.expected
		const value = sample.results[elementID]

		if (!expected || !value) return undefined

		const lowerLimit = expected * (1 - checkStandardLimit)
		const upperLimit = expected * (1 + checkStandardLimit)

		return {
			passes: value >= lowerLimit && value <= upperLimit,
			recovery: ((value / expected) * 100).toFixed(0)
		}
	}
</script>

<table class="results">
	<HeaderRow firstColumnLabel="Check Standard" />

	<tbody>
		<tr class="border-b border-b-gray-400">
			<td class="firstCol">{sample.name}</td>

			{#each $reportData?.meta.orderedElements ?? [] as elementID}
				{@const methodElement = $methodElementsStore?.find(
					(e) => `${e.symbol}${e.mass}` === elementID
				)}

				{#if methodElement}
					{@const units =
						$methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)?.units || "ppm"}
					{@const prettyValue =
						units === "ppb" ? sample.results[elementID] : sample.results[elementID] * 1000}
					<td class="text-center">
						{prettyValue.toPrecision(3)}
					</td>
				{/if}
			{/each}
		</tr>

		{#if checkStandardLimit}
			<tr>
				<td>Recovery</td>
				{#each $reportData?.meta.orderedElements ?? [] as elementID}
					{#if $methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)}
						{@const { passes, recovery } = elementPassing(elementID) ?? { passes: undefined }}
						{#if passes != undefined}
							<td class={passes ? "passes" : "fails"}>
								{recovery}%
							</td>
						{:else}
							<td class="neutral">- -</td>
						{/if}
					{/if}
				{/each}
			</tr>
		{/if}
	</tbody>
</table>
