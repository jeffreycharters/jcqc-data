<script lang="ts">
	import HeaderRow from "./HeaderRow.svelte"
	import type { RunListEntry } from "../../app"
	import { toSigFigs } from "$lib/data"
	import { getMethodContext, getMethodElementsContext } from "$lib/storage"
	import { validateCheckStandard } from "$lib/report"

	export let sample: RunListEntry

	const method = getMethodContext()
	const methodElements = getMethodElementsContext()
	const checkStandardLimit = ($method?.checkStandardTolerance ?? 0) / 100
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
						{@const result = validateCheckStandard(sample, element.id, checkStandardLimit)}
						{#if result.passing != undefined}
							<td class={result.passing ? "passes" : "fails"}>
								{result.recovery}%
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
