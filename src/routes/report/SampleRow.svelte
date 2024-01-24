<script lang="ts">
	import { reportData } from "$lib/stores"
	import type { RunListEntry } from "../../app"
	import { methodElementsStore } from "$lib/stores"
	import { toSigFigs } from "$lib/data"

	export let sample: RunListEntry
	export let index: number
</script>

<tr class:bg-stone-200={index % 2 === 1}>
	<td>
		{sample.name}
	</td>
	{#each $reportData?.meta.orderedElements ?? [] as elementID}
		{#if $methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)}
			<td>
				{toSigFigs(sample.results[elementID])}
			</td>
		{/if}
	{/each}
</tr>
