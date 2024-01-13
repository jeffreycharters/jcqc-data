<script lang="ts">
	import { roundToSigFigs } from "$lib/data"
	import { methodElementsStore, reportData } from "$lib/stores"
	import type { RunListEntry } from "../../app"
	import HeaderRow from "./HeaderRow.svelte"

	export let calBlank: RunListEntry
	const orderedElements = $reportData?.meta.orderedElements ?? []

	const allCalibrations: RunListEntry[] = [calBlank, ...(calBlank?.calStandards ?? [])]
</script>

<div>
	<h1>Calibration Data</h1>

	<table class="results">
		<HeaderRow firstColumnLabel="Standard Name" />

		<tbody>
			{#each allCalibrations as sample}
				<tr>
					<td class="max-w-[175px] truncate text-left">{sample.name}</td>
					{#each orderedElements as elementID}
						{@const prettyValue =
							$methodElementsStore?.find((e) => `${e.symbol}${e.mass}` === elementID)?.units ===
							"ppm"
								? sample.results[elementID] * 1000
								: sample.results[elementID]}
						<td class="text-center">{roundToSigFigs(prettyValue, 3)}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<br />

	<h1>Sample Data</h1>
</div>

<style lang="postcss">
	tr:nth-of-type(even) {
		@apply bg-stone-200;
	}
</style>
