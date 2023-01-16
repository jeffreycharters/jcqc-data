<script lang="ts">
	import {
		createMethodElement,
		setMethodElementUnitsById,
		toggleMethodElementActive
	} from '$lib/methods';
	import { method } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';

	export let element: MethodElement;
	$: divClass = element.active ? 'active-element' : 'inactive-element';

	const dispatch = createEventDispatcher();

	const toggleElementActive = async () => {
		console.log(element);

		if (!element || !element.id) return;

		if (element.inDb) await toggleMethodElementActive(element.id, !element.active);
		else {
			const newMethodElement = await createMethodElement(element.elementId, $method.id);
			element.inDb = true;
			element.id = newMethodElement.id;
		}
		const updatedElement = await toggleMethodElementActive(element.id, !element.active);
		if (!updatedElement) return; //error?
		if (updatedElement && updatedElement.active != undefined)
			element.active = updatedElement.active;
		dispatch('toggleElement', element);
	};

	const setUnits = async (newUnits: Units) => {
		const updatedElement = await setMethodElementUnitsById(element.id, newUnits);
		if (!updatedElement) return; // error?
		element.units = updatedElement.units;
	};
</script>

<div class="{divClass} relative w-full max-w-md">
	<div class="flex flex-col flex-start ml-8">
		<div class="font-bold"><sup>{element.mass}</sup>{element.symbol}</div>
		<button class="inactivate-button" on:click={toggleElementActive}
			>{element.active ? 'Remove' : 'Add'}</button
		>
	</div>

	{#if element.active}
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
	{/if}
</div>

<style lang="postcss">
	.active-element {
		@apply border border-black rounded shadow py-2 px-4 flex items-center justify-around;
	}
	.inactive-element {
		@apply border border-gray-300 rounded shadow py-2 px-4 flex items-center justify-start text-gray-400;
	}
	.active-units {
		@apply border border-gray-800 shadow font-bold text-xs pt-0 pb-1 rounded px-2;
	}
	.inactive-units {
		@apply border border-gray-400 shadow text-xs pt-0 pb-1 rounded px-2 border-dotted text-gray-500;
	}
	.list-grid-elements {
		@apply grid grid-cols-5 gap-4;
	}
</style>
