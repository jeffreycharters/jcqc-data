<script lang="ts">
	import HeaderRow from "./HeaderRow.svelte"
	import type { RunListEntry } from "../../app"
	import { toSigFigs } from "$lib/data"
	import { getMethodContext, getMethodElementsContext } from "$lib/storage"

	export let sample: RunListEntry

	const method = getMethodContext()
	const methodElements = getMethodElementsContext()
	const checkStandardLimit = ($method?.checkStandardTolerance ?? 0) / 100

	function elementPassing(elementID: string) {
		const expected = sample.checkStandard?.values[elementID]
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
	<HeaderRow firstColumnLabel="Check Standard" ppbUnits={true} />

	<tbody>
		<tr class="border-b border-b-gray-400">
			<td class="firstCol">{sample.name}</td>

			{#each $method?.elements ?? [] as element}
				{@const value = sample.results[element.id]}
				{@const prettyValue =
					$methodElements?.find((me) => me.element === element.id)?.units === "ppb"
						? value
						: value * 1000}
				<td class="text-center">
					{toSigFigs(prettyValue, 3)}
				</td>
			{/each}
		</tr>

		{#if checkStandardLimit}
			<tr>
				<td>Recovery</td>
				{#each $method?.elements ?? [] as element}
					{#if $methodElements?.find((me) => me.element === element.id)}
						{@const { passes, recovery } = elementPassing(element.id) ?? {
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
