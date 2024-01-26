<script lang="ts">
	import { browser } from "$app/environment"
	import { methodElementsStore, methodStore, reportData } from "$lib/stores"

	import HeaderInfo from "./HeaderInfo.svelte"
	import Calibration from "./Calibration.svelte"
	import CheckStandard from "./CheckStandard.svelte"
	import MethodBlank from "./MethodBlank.svelte"
	import ReferenceMaterial from "./ReferenceMaterial.svelte"
	import SampleBlock from "./SampleBlock.svelte"
	import SampleRow from "./SampleRow.svelte"
	import Duplicate from "./Duplicate.svelte"

	// @ts-expect-error
	import IconSkull from "@tabler/icons-svelte/dist/svelte/icons/IconSkull.svelte"

	// @ts-expect-error
	import IconArrowBackUpDouble from "@tabler/icons-svelte/dist/svelte/icons/IconArrowBackUpDouble.svelte"

	export let data
	const { sampleList } = data

	const methodElementCount = $methodElementsStore?.length ?? 0
	$methodElementsStore?.sort((a, b) => a.mass - b.mass)
</script>

<div class="report-container w-fit p-4">
	{#if $methodElementsStore?.length != $reportData?.meta.elementCount}
		<div class="flex flex-col gap-4">
			<div
				class="no-print mx-auto mt-8 flex w-fit animate-bounce items-center gap-4 rounded border border-red-500 bg-red-200 px-4 py-2 text-sm text-red-600"
			>
				<IconSkull class="h-8 w-8 stroke-[1.5]" />
				<div>
					<p class="mb-1 text-lg font-semibold">Warning!</p>
					<p class="text-sm">
						Expected {methodElementCount} element{methodElementCount === 1 ? "" : "s"}, found {$reportData
							?.meta.elementCount}.
					</p>
					<p class="text-sm font-semibold italic">Possible method mismatch.</p>
				</div>
			</div>
			<button
				class="btn flex items-center justify-center gap-2 font-semibold uppercase"
				on:click={() => window.history.back()}
			>
				<IconArrowBackUpDouble class="stroke-stone-500" />
				<span class="text-lg text-stone-600">Go back</span>
			</button>
		</div>
	{:else}
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
	{/if}
</div>

<style lang="postcss">
	.report-container {
		font-family: Arial, Helvetica, sans-serif;
		@apply text-[0.75rem];
	}
</style>
