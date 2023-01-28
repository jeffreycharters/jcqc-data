<script lang="ts">
	import type { Analyte } from '$lib/classes';
	import ElementWithMass from '$lib/components/ElementWithMass.svelte';
	import type { BlanksResponse, DetectionLimitsResponse } from '$lib/pocketbase-types';
	import { method } from '$lib/stores';

	export let blank: BlanksResponse;

	let detectionLimits: DetectionLimitsResponse[] = blank.expand?.detectionLimits ?? [];
	$: elementList = $method.elements;

	const deleteBlank = async () => {
		await $method.deleteBlank(blank.name);
		$method = $method;
	};
</script>

<div class="basic-border w-full h-full p-4">
	<div class="flex justify-between items-baseline">
		<h3>{blank.name}</h3>
		<button on:click={deleteBlank}>delete</button>
	</div>

	{#if elementList && elementList.length > 0}
		<div class="grid grid-cols-5 gap-4 text-center">
			{#each elementList.sort((a, b) => (a.mass < b.mass ? -1 : 1)) as element}
				{@const limits = detectionLimits.find((dl) => dl.element === element.id)}
				<div class="basic-border">
					<div class="flex items-center justify-center h-full gap-4">
						<ElementWithMass symbol={element.symbol} mass={element.mass} />
						<span class="text-gray-500">{element.units}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
