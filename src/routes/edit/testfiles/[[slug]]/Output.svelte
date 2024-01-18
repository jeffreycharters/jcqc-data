<script lang="ts">
	import SpreadRows from "./SpreadRows.svelte"
	import { calibrationRows, checkStandardRows, rinseRows } from "$lib/testfiles"

	const headerRow =
		"Sample Name,Dilution Factor,Sample Weight or Volume,Analyte,Mass,Concentration,Units\r\n"

	const calibration = calibrationRows()

	let csv: HTMLDivElement

	const copyToClipboard = () => {
		if (!csv) return
		navigator.clipboard.writeText(csv.innerText)
	}
</script>

<button class="btn" on:click={copyToClipboard}>Copy all</button>

<div class="font-mono" bind:this={csv}>
	{headerRow}
	<SpreadRows rows={rinseRows()} />
	<SpreadRows rows={calibration} />
	<SpreadRows rows={rinseRows()} />
	<SpreadRows rows={rinseRows()} />
	<SpreadRows rows={checkStandardRows()} />
</div>
