<script lang="ts">
	import { roundToSigFigs, sortedArrayFromMap } from "$lib/data"
	import type {
		ReferenceMaterialsRangesResponse,
		ReferenceMaterialsResponse
	} from "$lib/pocketbase-types"
	import { methodStore } from "$lib/stores"
	import HeaderRow from "./HeaderRow.svelte"

	export let sample: RunListEntry
	export let rm: ReferenceMaterialsResponse | undefined

	let values = sortedArrayFromMap(sample.results.values)

	type PassesString = "passes" | "fails" | "neutral"

	const checkRanges = (
		value: number,
		ranges: ReferenceMaterialsRangesResponse
	): [PassesString, string] => {
		const { lower, upper } = ranges

		if ((lower === 0 && upper === 0) || (!lower && !upper)) return ["neutral", "- -"]
		if ((!lower || lower === 0) && upper && value < upper) return ["passes", "Yes"]
		if ((!upper || upper === 0) && lower && value > lower) return ["passes", "Yes"]
		if (lower && upper && value > lower && value < upper) return ["passes", "Yes"]
		return ["fails", "No"]
	}
</script>

<div>
	<br />
	<table class="results">
		<HeaderRow firstColumnLabel="Reference Material" />

		<tbody>
			<tr class="border-b border-b-gray-400">
				<td class="firstCol">{sample.name}</td>
				{#each values as [_, value]}
					<td>
						{roundToSigFigs(value, 3)}
					</td>
				{/each}
			</tr>
			<tr>
				<td class="firstCol">Within Range</td>

				{#each values as [mass, value]}
					{@const ranges = $methodStore?.getValue(
						"referenceMaterials",
						rm?.name ?? "",
						"ranges",
						$methodStore.getElementIdFromMass(mass) ?? ""
					)}

					{#if ranges}
						{@const [passes, output] = checkRanges(value, ranges)}

						<td class={passes}>
							{output}
						</td>
					{/if}
				{/each}
			</tr>
		</tbody>
	</table>
	<br />
</div>
