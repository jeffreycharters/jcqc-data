<script lang="ts">
	import { reportData } from "$lib/stores"
	import type { RunListEntry } from "../../app"
	import { methodElementsStore } from "$lib/stores"
	import { toSigFigs } from "$lib/data"
	import { methodElementsID } from "$lib/elements"

	export let sample: RunListEntry
	export let index: number
</script>

<tr class:bg-stone-200={index % 2 === 1}>
	<td>
		{sample.name}
	</td>
	{#each $methodElementsStore ?? [] as methodElement}
		{#if $methodElementsStore?.find((e) => e.mass === methodElement.mass)}
			<td>
				{toSigFigs(sample.results[methodElementsID(methodElement)])}
			</td>
		{/if}
	{/each}
</tr>
