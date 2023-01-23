<script lang="ts">
	import { methodParams, reportData } from '$lib/stores';
	import HeaderInfo from './HeaderInfo.svelte';
	import Calibration from './Calibration.svelte';
	import CheckStandard from './CheckStandard.svelte';
	import MethodBlank from './MethodBlank.svelte';

	const submissionRegex = /\d{2}-\d{6}-\d{4}/;
	let methodElementCount = $methodParams.elements.length;
	let analysisElementCount = $reportData[0]?.results.values.size;

	let referenceMaterialsLower = $methodParams.referenceMaterialNames.map((rm) => rm.toLowerCase());
</script>

<div class="report-container">
	{#if methodElementCount != analysisElementCount}
		<div class="text-red-500 text-sm w-fit mx-auto font-semibold">
			Warning: expected {methodElementCount} element{methodElementCount === 1 ? '' : 's'}, found {analysisElementCount}.
			Possible method mismatch.
		</div>
	{/if}

	<HeaderInfo />

	{#each $reportData as sample, index (sample.id)}
		{@const sampleNameLower = sample.name.toLowerCase()}
		<div>
			{#if ['calibration blank', 'cal blank'].includes(sampleNameLower)}
				<Calibration
					samples={$reportData.slice(index, index + $methodParams.method.calibrationCount + 1)}
				/>
			{/if}

			{#if ['calibration check', 'cal check'].includes(sampleNameLower)}
				<CheckStandard {sample} />
			{/if}

			{#if sampleNameLower === 'method blank'}
				<!-- <strong>Method Blank</strong> -->
				<MethodBlank {sample} />
			{/if}

			{#if sample.isDup}
				<strong>Duplicate!</strong>
			{/if}

			{#if referenceMaterialsLower.includes(sampleNameLower)}
				<strong>Reference Material</strong>
			{/if}

			{#if (submissionRegex.test(sample.name) || sample.name
					.toLowerCase()
					.startsWith('qc')) && !sample.isDup}
				<strong>Normal sample!</strong>
			{/if}
		</div>
	{/each}
</div>

<style lang="postcss">
	.report-container {
		font-family: Arial, Helvetica, sans-serif;
		@apply text-[0.8rem];
	}
</style>
