<script lang="ts">
	import { toSigFigs } from "$lib/data"
	import { getMethodContext, getMethodElementsContext } from "$lib/storage"

	export let sample: RunListEntry
	export let index: number

	const method = getMethodContext()
	const methodElements = getMethodElementsContext()
</script>

<tr class:bg-stone-200={index % 2 === 1}>
	<td>
		{sample.name}
	</td>
	{#each $method?.elements ?? [] as element}
		{#if $methodElements?.find((me) => me.element === element.id)}
			<td>
				{toSigFigs(sample.results[element.id])}
			</td>
		{/if}
	{/each}
</tr>
