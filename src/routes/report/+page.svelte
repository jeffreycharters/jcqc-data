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

	import { IconSkull } from "@tabler/icons-svelte"

	export let data
	const { sampleList } = data

	const methodElementCount = $methodElementsStore?.length ?? 0
	const outputElementCount = $reportData?.meta.orderedElements.length ?? 0
</script>

<div class="report-container p-4 w-fit">
	{#if $methodElementsStore?.length != outputElementCount}
		<div
			class="flex gap-4 items-center text-sm w-fit mx-auto border border-red-500 bg-red-200 text-red-600 rounded py-2 px-4 no-print mb-4 absolute top-8 right-8 motion-safe:animate-bounce"
		>
			<IconSkull class="h-8 w-8 stroke-[1.5]" />
			<div>
				<p class="font-semibold mb-1">Warning!</p>
				<p class="text-xs">
					Expected {methodElementCount} element{methodElementCount === 1 ? "" : "s"}, found {outputElementCount}.
				</p>
				<p class="text-xs italic">Possible method mismatch.</p>
			</div>
		</div>
	{/if}

	<HeaderInfo />

	{#if browser && $reportData}
		{#each sampleList ?? [] as block}
			{#if block.type === "qc" && block.sample.calStandards}
				<Calibration calBlank={block.sample} />

				<h1>Sample Data</h1>
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

<style lang="postcss">
	.report-container {
		font-family: Arial, Helvetica, sans-serif;
		@apply text-[0.75rem];
	}
</style>
