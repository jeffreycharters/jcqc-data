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

	export let data
	const { sampleList } = data

	const methodElementCount = $methodElementsStore?.length ?? 0
	const outputElementCount = $reportData?.meta.orderedElements.length ?? 0
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
			{#each sampleList ?? [] as block}
				{#if block.type === "qc" && block.sample.calStandards}
					<Calibration calBlank={block.sample} />
				{/if}

				{#if block.type === "qc" && block.sample.checkStandard}
					<CheckStandard sample={block.sample} />
				{/if}

				{#if block.type === "qc" && block.sample.blank}
					<MethodBlank sample={block.sample} />
				{/if}

				{#if block.type === "qc" && block.sample.referenceMaterial}
					<ReferenceMaterial sample={block.sample} />
				{/if}

				{#if block.type === "qc" && block.sample.duplicateSamples}
					{#each block.sample.duplicateSamples as duplicate}
						<Duplicate sample={block.sample} {duplicate} />
					{/each}
				{/if}

				{#if block.type === "sampleBlock"}
					<SampleBlock>
						{#each block.samples as sample, index}
							<SampleRow {sample} {index} />
						{/each}
					</SampleBlock>
				{/if}
			{/each}
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
