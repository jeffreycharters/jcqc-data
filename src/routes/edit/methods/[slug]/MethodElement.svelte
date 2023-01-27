<script lang="ts">
	import type { ElementsResponse } from '$lib/pocketbase-types';
	import { createEventDispatcher } from 'svelte';

	export let element: ElementsResponse;
	export let active: boolean;

	let checkStd = 'cat';

	let formHasError = false;
	$: errorClasses = formHasError
		? 'border-red-600 text-red-600 border-b-red-700'
		: 'border-b-gray-400';

	const dispatch = createEventDispatcher();

	const toggleElementActive = async () => {
		// if (!element || !element.id) return;

		// if (element.inDb) await toggleMethodElementActive(element.id, !element.active);
		// else {
		// 	const newMethodElement = await createMethodElement(element.elementId, $method.id);
		// 	element.inDb = true;
		// 	element.id = newMethodElement.id;
		// 	element.units = 'ppm';
		// }
		// const updatedElement = await toggleMethodElementActive(element.id, !element.active);
		// if (!updatedElement) return; //error?
		// if (updatedElement && updatedElement.active != undefined)
		// 	element.active = updatedElement.active;
		dispatch('toggleElement', element);
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
		<button class="inactivate-button" on:click={toggleElementActive}
			>{active ? 'Remove' : 'Add'}</button
		>
	</div>

	{#if active}
		<div class="flex flex-col gap-2 items-end">
			<div class="flex gap-1 items-baseline">
				<button
					class={'ppb' === 'ppb' ? 'active-units' : 'inactive-units'}
					on:click={() => setUnits('ppb')}
					disabled={'ppb' === 'ppb'}>ppb</button
				>

				<button
					class={'ppm' === 'ppm' ? 'active-units' : 'inactive-units'}
					on:click={() => setUnits('ppm')}
					disabled={'ppm' === 'ppm'}>ppm</button
				>
			</div>

			<div class="flex gap-1 text-sm">
				<label for="cal-check-{element.symbol}">Cal Check</label>
				<input
					bind:value={checkStd}
					type="text"
					name="cal-check-{element.symbol}"
					class="border border-b-2 p-0 w-8 rounded text-center relative mx-1 {errorClasses}"
					on:keyup={processUpdate()}
					on:click={() => (checkStd === '- -' ? (checkStd = '') : '')}
				/>
				{'ppm'}
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
	.list-grid-elements {
		@apply grid grid-cols-5 gap-4;
	}
</style>
