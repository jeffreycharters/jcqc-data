<script lang="ts">
	import HeaderRow from "./HeaderRow.svelte"
	import { methodElementsStore, methodStore, reportData } from "$lib/stores"
	import type { RunListEntry } from "../../app"
	import { toSigFigs } from "$lib/data"
	import { methodElementsID } from "$lib/elements"

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

			{#each $methodElementsStore ?? [] as methodElement}
				{@const value = sample.results[methodElementsID(methodElement)]}
				{@const prettyValue = methodElement.units === "ppb" ? value : value * 1000}
				<td class="text-center">
					{toSigFigs(prettyValue, 3)}
				</td>
			{/each}
		</tr>

		{#if checkStandardLimit}
			<tr>
				<td>Recovery</td>
				{#each $methodElementsStore ?? [] as methodElement}
					{#if $methodElementsStore?.find((e) => e.symbol === methodElement.symbol)}
						{@const { passes, recovery } = elementPassing(methodElementsID(methodElement)) ?? {
							passes: undefined
						}}
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
