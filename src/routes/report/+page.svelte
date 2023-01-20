<script lang="ts">
	import { methodParams, reportData } from '$lib/stores';
	import HeaderInfo from './HeaderInfo.svelte';

	// $: console.log($reportData);
</script>

<!-- 
{#if $methodParams.elements.length != $reportData[0]?.results.results.size}
	<div class="text-red-500 text-sm w-fit mx-auto">
		Warning: expected {$methodParams.elements.length} element{$methodParams.elements.length === 1
			? ''
			: 's'}, found {$reportData[0][1]?.results?.size}. Possible method mismatch.
	</div>
{/if} -->

<!-- <HeaderInfo /> -->

<!-- {#each $reportData as sample (sample)}
	<div>
		{sample.name}
	</div>
{/each} -->
