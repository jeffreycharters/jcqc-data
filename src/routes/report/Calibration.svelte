<script lang="ts">
	import { toSigFigs } from "$lib/data"
	import { getMethodContext, getMethodElementsContext } from "$lib/storage"
	import type { RunListEntry } from "../../app"
	import HeaderRow from "./HeaderRow.svelte"

	export let calBlank: RunListEntry

	const method = getMethodContext()
	const methodElements = getMethodElementsContext()

	const allCalibrations: RunListEntry[] = [calBlank, ...(calBlank?.calStandards ?? [])]
</script>

<h1>Calibration Data</h1>

<table class="results calibration">
	<HeaderRow firstColumnLabel="Standard Name" ppbUnits={true} />

	<tbody>
		{#each allCalibrations as sample}
			<tr class="even:bg-stone-200">
				<td class="max-w-[175px] truncate text-left">{sample.name}</td>
				{#each $method?.elements ?? [] as element}
					{@const prettyValue =
						$methodElements?.find((me) => me.element === element.id)?.units === "ppm"
							? sample.results[element.symbol + element.mass] * 1000
							: sample.results[element.symbol + element.mass]}
					<td class="text-center">{toSigFigs(prettyValue, 3)}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
