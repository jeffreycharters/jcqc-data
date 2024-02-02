<script lang="ts">
	import { toSigFigs } from "$lib/data"
	import { methodElementsStore, reportData } from "$lib/stores"
	import { symbol } from "zod"
	import type { RunListEntry } from "../../app"
	import HeaderRow from "./HeaderRow.svelte"

	export let calBlank: RunListEntry

	const allCalibrations: RunListEntry[] = [calBlank, ...(calBlank?.calStandards ?? [])]
</script>

<h1>Calibration Data</h1>

<table class="results calibration">
	<HeaderRow firstColumnLabel="Standard Name" ppbUnits={true} />

	<tbody>
		{#each allCalibrations as sample}
			<tr class="even:bg-stone-200">
				<td class="max-w-[175px] truncate text-left">{sample.name}</td>
				{#each $methodElementsStore ?? [] as methodElement}
					{@const prettyValue =
						methodElement.units === "ppm"
							? sample.results[methodElement.symbol + methodElement.mass] * 1000
							: sample.results[methodElement.symbol + methodElement.mass]}
					<td class="text-center">{toSigFigs(prettyValue, 3)}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
