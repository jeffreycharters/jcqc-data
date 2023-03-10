<script lang="ts">
	import { method, reportData } from '$lib/stores';
	import HeaderInfo from './HeaderInfo.svelte';
	import Calibration from './Calibration.svelte';
	import CheckStandard from './CheckStandard.svelte';
	import MethodBlank from './MethodBlank.svelte';
	import ReferenceMaterial from './ReferenceMaterial.svelte';
	import SampleBlock from './SampleBlock.svelte';
	import SampleRow from './SampleRow.svelte';
	import Duplicate from './Duplicate.svelte';
	import { browser } from '$app/environment';

	let methodElementCount = $method?.elements?.length || 0;
	let analysisElementCount = $reportData?.length > 0 ? $reportData[0]?.results.values.size : 0;

	const getSampleBlock = (index: number) => {
		const samples: RunListEntry[] = [];
		while (index < $reportData.length) {
			const thisSample = $reportData[index];
			if (thisSample.isSample && !thisSample.isDup) samples.push(thisSample);
			else break;
			++index;
		}
		return samples;
	};
</script>

<div class="report-container mx-auto p-4">
	{#if methodElementCount != analysisElementCount}
		<div class="text-red-500 text-sm w-fit mx-auto font-semibold">
			Warning: expected {methodElementCount} element{methodElementCount === 1 ? '' : 's'}, found {analysisElementCount}.
			Possible method mismatch.
		</div>
	{/if}

	<HeaderInfo />

	<div>
		{#if browser && $reportData}
			{#each $reportData as sample, index (sample.id)}
				{#if index > 0 && sample.isSample && !$reportData[index - 1].isSample}
					{@const sampleBlockSamples = getSampleBlock(index)}
					<SampleBlock>
						{#each sampleBlockSamples as sample, index}
							<SampleRow {sample} {index} />
						{/each}
					</SampleBlock>
				{:else}
					{#if sample.isCalBlank}
						<Calibration
							samples={$reportData.slice(index, index + ($method?.calibrationCount ?? 0) + 1)}
						/>
					{/if}
					{#if sample.isCalCheck && $method?.checkStandards?.has(sample.name)}
						<CheckStandard {sample} checkStandard={$method?.checkStandards?.get(sample.name)} />
					{/if}

					{#if sample.isMethodBlank}
						<MethodBlank {sample} />
					{/if}

					{#if sample.isReferenceMaterial}
						<ReferenceMaterial {sample} rm={$method?.getReferenceMaterialNameByName(sample.name)} />
					{/if}

					{#if sample.isDup}
						<Duplicate {sample} />
					{/if}
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
