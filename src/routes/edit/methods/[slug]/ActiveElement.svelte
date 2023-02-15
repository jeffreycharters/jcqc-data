<script lang="ts">
	import type { Analyte } from '$lib/classes';
	import ElementWithMass from '$lib/components/ElementWithMass.svelte';
	import { method } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';
	export let element: Analyte;

	const dispatch = createEventDispatcher();

	const removeElement = async () => {
		if (!element || !element.id) return;
		dispatch('removeElement', element);
		$method = $method;
	};

	const setUnits = async (newUnits: Units) => {
		const updatedUnits = await $method?.updateElementUnits(element.unitsId, newUnits);
		element.units = updatedUnits?.units || 'unknown';
		dispatch('setMethodElementUnits', newUnits);
		if (!$method) return;
		$method.elements = $method?.elements;
	};
</script>

<div class="col-span-2">
	<div class="active-element relative h-full">
		<div class="flex flex-col h-full items-center">
			<ElementWithMass symbol={element.symbol} mass={element.mass} />
			<button class="inactivate-button" on:click={removeElement}>Remove</button>
		</div>

		<div class="flex flex-col gap-2 items-end">
			<div class="flex gap-1 items-baseline">
				<button
					class={element.units === 'ppb' ? 'active-units' : 'inactive-units'}
					on:click={() => setUnits('ppb')}
					disabled={element.units === 'ppb'}>ppb</button
				>

				<button
					class={element.units === 'ppm' ? 'active-units' : 'inactive-units'}
					on:click={() => setUnits('ppm')}
					disabled={element.units === 'ppm'}>ppm</button
				>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.active-element {
		@apply border border-gray-800 rounded shadow py-2 px-4 flex items-center justify-around;
	}
	.active-units {
		@apply border border-gray-800 shadow font-bold text-xs pt-0 pb-1 rounded px-2;
	}
	.inactive-units {
		@apply border border-gray-400 shadow text-xs pt-0 pb-1 rounded px-2 border-dotted text-gray-500;
	}
</style>
