<script lang="ts">
	import { roundToSigFigs } from "$lib/data"
	import { reportData } from "$lib/stores"
	import type { RunListEntry } from "../../app"

	export let sample: RunListEntry
</script>

<tr>
	<td>
		{sample.name}
	</td>
	{#each $reportData?.meta.orderedElements ?? [] as elementID}
		<td>
			{roundToSigFigs(sample.results[elementID], 3)}
		</td>
	{/each}
</tr>
