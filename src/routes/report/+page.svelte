<script lang="ts">
	import { browser } from "$app/environment"
	import { methodElementsStore, reportData } from "$lib/stores"

	import HeaderInfo from "./HeaderInfo.svelte"
	import Calibration from "./Calibration.svelte"
	import CheckStandard from "./CheckStandard.svelte"
	import MethodBlank from "./MethodBlank.svelte"
	import ReferenceMaterial from "./ReferenceMaterial.svelte"
	import SampleBlock from "./SampleBlock.svelte"
	import SampleRow from "./SampleRow.svelte"
	import Duplicate from "./Duplicate.svelte"
	import type { RunListEntry } from "../../app"

	const methodElementCount = $methodElementsStore?.length ?? 0
	const outputElementCount = $reportData?.meta.orderedElements.length ?? 0

	const getSampleBlock = (i: number) => {
		let samples: RunListEntry[] = []
		while (i < ($reportData?.samples.length ?? 0)) {
			const thisSample = $reportData?.samples[i]
			if (!thisSample?.isSample) break

			samples = [...samples, thisSample]
			i++
		}
		return samples
	}
</script>

<div class="report-container mx-auto p-4">
	{#if $methodElementsStore?.length != outputElementCount}
		<div class="text-red-500 text-sm w-fit mx-auto font-semibold">
			Warning: expected {methodElementCount} element{methodElementCount === 1 ? "" : "s"}, found {outputElementCount}.
			Possible method mismatch.
		</div>
	{/if}

	<HeaderInfo />

	<div>
		{#if browser && $reportData}
			<SampleBlock>
				{#each $reportData.samples as sample, index}
					<SampleRow {sample} {index} />
				{/each}
			</SampleBlock>
		{:else}
			<div class="text-error">
				No data found! <a class="text-black" href="/">Click here to start over.</a>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.report-container {
		font-family: Arial, Helvetica, sans-serif;
		@apply text-[0.75rem];
	}
</style>
