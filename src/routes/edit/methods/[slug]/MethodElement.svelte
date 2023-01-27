<script lang="ts">
	import type { Analyte } from '$lib/classes';
	import { createEventDispatcher } from 'svelte';

	export let element: Analyte;
	export let active: boolean;

	let formHasError = false;
	$: errorClasses = formHasError
		? 'border-red-600 text-red-600 border-b-red-700'
		: 'border-b-gray-400';

	const dispatch = createEventDispatcher();

	const addElement = async () => {
		if (!element || !element.id) return;
		dispatch('addElement', element);
	};

	const setUnits = async (newUnits: Units) => {
		// const updatedElement = await setMethodElementUnitsById(element.id, newUnits);
		// if (!updatedElement) return; // error?
		// element.units = updatedElement.units ?? 'ppm';
		dispatch('setMethodElementUnits', newUnits);
	};

	function debounce(callback: () => void, timeout = 300) {
		let timer: NodeJS.Timer;
		return (...args: any) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				callback.apply(debounce, args);
			}, timeout);
		};
	}

	const updateCalCheck = async () => {
		// if (isNaN(Number(checkStd))) {
		// 	formHasError = true;
		// 	return;
		// }
		// formHasError = false;
		// const updatedElement = await setCalCheckValueByMethodelementId(element.id, Number(checkStd));
		// if (updatedElement.checkStandard != checkStd) formHasError = true;
	};

	const processUpdate = () => debounce(() => updateCalCheck());
</script>

<div class="{active ? 'active-element' : 'inactive-element'} relative h-full">
	<div class="flex flex-col h-full justify-between">
		<div class="font-bold"><sup>{element.mass}</sup>{element.symbol}</div>
		<button class="inactivate-button" on:click={addElement}>{active ? 'Remove' : 'Add'}</button>
	</div>

	{#if active}
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
	{/if}
</div>

<style lang="postcss">
	.active-element {
		@apply border border-gray-800 rounded shadow py-2 px-4 flex items-center justify-around;
	}
	.inactive-element {
		@apply border border-gray-300 rounded shadow py-2 px-4 flex items-center justify-around text-gray-400;
	}
	.active-units {
		@apply border border-gray-800 shadow font-bold text-xs pt-0 pb-1 rounded px-2;
	}
	.inactive-units {
		@apply border border-gray-400 shadow text-xs pt-0 pb-1 rounded px-2 border-dotted text-gray-500;
	}
</style>
