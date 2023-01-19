<script lang="ts">
	import { methodParams, reportData } from '$lib/stores';

	$: data = Array.from($reportData);
</script>

{#if $methodParams.elements.length != data[0][1]?.results?.size}
	<div class="text-red-500 text-sm w-fit mx-auto">
		Warning: expected {$methodParams.elements.length} element{$methodParams.elements.length === 1
			? ''
			: 's'}, found {data[0][1]?.results?.size}. Possible method mismatch.
	</div>
{/if}

{#each data as [key, value], sample (sample)}
	<div>
		{key}
	</div>
{/each}
