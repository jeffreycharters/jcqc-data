<script lang="ts">
	import { roundToSigFigs, sortedArrayFromMap } from "$lib/data"
	import HeaderRow from "./HeaderRow.svelte"
	import { methodStore } from "$lib/stores"
	import type { CheckStandardsResponse } from "$lib/pocketbase-types"

	export let sample: RunListEntry
	export let checkStandard: CheckStandardsResponse | undefined

	let values = sortedArrayFromMap(sample.results.values)
	$: checkStandardLimit = ($methodStore?.checkStandardTolerance ?? 0) / 100
</script>

<div>
	<table class="results">
		<HeaderRow firstColumnLabel="Check Standard" allPpb={true} />

		<tbody>
			<tr class="border-b border-b-gray-400">
				<td class="firstCol">{sample.name}</td>

				{#each values as [mass, value]}
					{@const units = $methodStore?.elements?.find((e) => e.mass === mass)?.units || "ppm"}
					{@const prettyValue = units === "ppb" ? value : value * 1000}
					<td class="text-center">
						{roundToSigFigs(prettyValue, 3)}
					</td>
				{/each}
			</tr>

			{#if checkStandardLimit}
				<tr>
					<td>Within Range</td>
					{#each values as [key, value]}
						{@const elementExpected =
							$methodStore?.getValue(
								"checkStandards",
								checkStandard?.name ?? "",
								"checkValues",
								$methodStore.getElementIdFromMass(key) ?? ""
							)?.value ?? 0}
						{@const tolerance = elementExpected * checkStandardLimit}
						{@const passes =
							value < elementExpected + tolerance && value > elementExpected - tolerance}
						{#if elementExpected != 0}
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
	<br />
</div>
