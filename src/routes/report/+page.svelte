<script lang="ts">
	import { methodParams, reportData } from '$lib/stores';
	import HeaderInfo from './HeaderInfo.svelte';
	import Calibration from './Calibration.svelte';
	import CheckStandard from './CheckStandard.svelte';
	import MethodBlank from './MethodBlank.svelte';
	import ReferenceMaterial from './ReferenceMaterial.svelte';
	import SampleBlock from './SampleBlock.svelte';
	import SampleRow from './SampleRow.svelte';

	let methodElementCount = $methodParams.elements.length;
	let analysisElementCount = $reportData[0]?.results.values.size;

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

<div class="report-container">
	{#if methodElementCount != analysisElementCount}
		<div class="text-red-500 text-sm w-fit mx-auto font-semibold">
			Warning: expected {methodElementCount} element{methodElementCount === 1 ? '' : 's'}, found {analysisElementCount}.
			Possible method mismatch.
		</div>
	{/if}

	<HeaderInfo />

	<div>
		{#each $reportData as sample, index (sample.id)}
			{#if index > 0 && sample.isSample && !$reportData[index - 1].isSample}
				{@const sampleBlockSamples = getSampleBlock(index)}
				<SampleBlock>
					{#each sampleBlockSamples as sample}
						<SampleRow {sample} />
					{/each}
				</SampleBlock>
			{:else}
				{#if sample.isCalBlank}
					<Calibration
						samples={$reportData.slice(index, index + $methodParams.method.calibrationCount + 1)}
					/>
				{/if}

				{#if sample.isCalCheck}
					<CheckStandard {sample} />
				{/if}

				{#if sample.isMethodBlank}
					<MethodBlank {sample} />
				{/if}

				{#if sample.isReferenceMaterial}
					<ReferenceMaterial {sample} />
				{/if}

				{#if sample.isDup}
					<strong>Duplicate!</strong>
				{/if}
			{/if}
		{/each}
	</div>
</div>

<style lang="postcss">
	.report-container {
		font-family: Arial, Helvetica, sans-serif;
		@apply text-[0.8rem];
	}
</style>
