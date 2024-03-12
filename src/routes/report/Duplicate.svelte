<script lang="ts">
	import { toSigFigs } from "$lib/data"
	import { meanAverage, relativePercentDeviation, duplicatePassingStatus } from "$lib/report"
	import { getMethodContext } from "$lib/storage"
	import HeaderRow from "./HeaderRow.svelte"

	export let sample: RunListEntry
	export let duplicate: RunListEntry

	const method = getMethodContext()
	const rpdLimit = $method?.rpdLimit ?? 0
</script>

<table class="results relative">
	<HeaderRow firstColumnLabel="Duplicate" />

	<tbody>
		<tr class="">
			<td class="firstCol">{sample.name}</td>

			{#each $method?.elements ?? [] as element}
				<td class="text-center">
					{toSigFigs(sample.results[element.id])}
				</td>
			{/each}
		</tr>

		<tr class="border-b border-b-gray-400">
			<td class="firstCol">{sample.name} DUP</td>

			{#each $method?.elements ?? [] as element}
				<td class="text-center">
					{toSigFigs(duplicate.results[element.id])}
				</td>
			{/each}
		</tr>

		<tr class="border-b border-gray-500">
			<td>Average</td>
			{#each $method?.elements ?? [] as element}
				<td>
					{toSigFigs(meanAverage(sample.results[element.id], duplicate.results[element.id]))}
				</td>
			{/each}
		</tr>

		<tr>
			<td>RPD</td>
			{#each $method?.elements ?? [] as element}
				{@const rpd = relativePercentDeviation(
					sample.results[element.id],
					duplicate.results[element.id]
				)}
				{@const loq = sample.referenceBlank?.loqs[element.id]}
				{@const average = meanAverage(sample.results[element.id], duplicate.results[element.id])}
				{@const passing = duplicatePassingStatus(average, loq, rpd, rpdLimit)}
				<td class={passing}>
					{#if rpd === undefined}
						- -
					{:else}
						{toSigFigs(rpd, 2)}%
					{/if}
				</td>
			{/each}
		</tr>
	</tbody>
	{#if ($method?.blanks?.length ?? 0) > 1}
		<tfoot>
			<tr>
				<td colspan="100">
					<div class="text-right text-xs italic text-stone-500">
						LOQs taken from <span class="font-bold">{sample.referenceBlank?.name ?? "unknown"}</span
						>. If this is incorrect be sure to verify RPDs.
					</div>
				</td>
			</tr>
		</tfoot>
	{/if}
</table>
