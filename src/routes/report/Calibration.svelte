<script lang="ts">
	import { toSigFigs } from "$lib/data"
	import { methodElementsStore, reportData } from "$lib/stores"
	import type { RunListEntry } from "../../app"
	import HeaderRow from "./HeaderRow.svelte"

	export let calBlank: RunListEntry
	const orderedElements = $reportData?.meta.orderedElements ?? []

	const allCalibrations: RunListEntry[] = [calBlank, ...(calBlank?.calStandards ?? [])]
</script>

<h1>Calibration Data</h1>

<table class="results">
	<HeaderRow firstColumnLabel="Standard Name" />

	<tbody>
		{#each allCalibrations as sample}
			<tr class="even:bg-stone-200">
				<td class="max-w-[175px] truncate text-left">{sample.name}</td>
				{#each orderedElements as elementID}
					{#if $methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)}
						{@const prettyValue =
							$methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)?.units ===
							"ppm"
								? sample.results[elementID] * 1000
								: sample.results[elementID]}
						<td class="text-center">{toSigFigs(prettyValue, 3)}</td>
					{/if}
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
