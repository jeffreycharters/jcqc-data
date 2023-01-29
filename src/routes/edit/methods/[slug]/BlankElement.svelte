<script lang="ts">
	import type { Analyte } from '$lib/classes';
	import ElementWithMass from '$lib/components/ElementWithMass.svelte';
	import type { DetectionLimitsResponse } from '$lib/pocketbase-types';
	import { method } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';

	export let element: Analyte;
	export let blankName: string;
	const dispatch = createEventDispatcher();

	let allDetectionLimits: DetectionLimitsResponse[] =
		$method.blanks?.get(blankName)?.expand?.detectionLimits;
	const detectionLimits = allDetectionLimits?.find((dl) => dl.element === element.id) ?? undefined;

	let mdlBase = allDetectionLimits.find(
		(detectionLimit: DetectionLimitsResponse) => detectionLimit.element === element.id
	)?.mdl;
	let mdl = !mdlBase || mdlBase === 0 ? '- -' : mdlBase;
	let loqBase = allDetectionLimits.find(
		(detectionLimit: DetectionLimitsResponse) => detectionLimit.element === element.id
	)?.loq;
	let loq = !loqBase || loqBase === 0 ? '- -' : loqBase;

	function debounce(callback: () => void, timeout = 1000) {
		let timer: NodeJS.Timer;
		return (...args: any) => {
			dispatch('updateStatus', 'Pending...');
			clearTimeout(timer);
			timer = setTimeout(() => {
				callback.apply(debounce, args);
			}, timeout);
		};
	}

	const updateCalCheck = async (toUpdate: 'mdl' | 'loq') => {
		// update database
		await $method.updateDetectionLimits(
			detectionLimits?.id ?? '',
			toUpdate,
			Number(toUpdate === 'mdl' ? mdl : loq)
		);
		dispatch('updateStatus', 'Saved!');
	};

	const processUpdate = (toUpdate: 'mdl' | 'loq') => debounce(() => updateCalCheck(toUpdate));
</script>

<form class="basic-border flex flex-col pt-2">
	<div class="flex items-center justify-center h-full gap-4">
		<ElementWithMass symbol={element.symbol} mass={element.mass} />
		<span class="text-gray-500">{element.units}</span>
	</div>
	<div class="flex items-center gap-2 justify-center">
		<label for={`${element.id}-mdl`}>MDL:</label>
		<div class="w-16">
			<input
				type="text"
				name={`${element.id}-mdl`}
				bind:value={mdl}
				on:keypress={processUpdate('mdl')}
				on:focus={() => (mdl = mdl === '- -' ? '' : mdl)}
				on:blur={() => (mdl = mdl === '' ? '- -' : mdl)}
				class="number-input mt-1 mb-2 text-sm text-center {mdl === '- -' ? 'text-gray-500' : ''}"
			/>
		</div>
	</div>
	<div class="flex items-center gap-2 justify-center">
		<label for={`${element.id}-loq`}>LOQ:</label>
		<div class="w-16">
			<input
				type="text"
				name={`${element.id}-loq`}
				bind:value={loq}
				on:keypress={processUpdate('loq')}
				on:focus={() => (loq = loq === '- -' ? '' : loq)}
				on:blur={() => (loq = loq === '' ? '- -' : loq)}
				class="number-input mt-1 mb-2 text-sm text-center {loq === '- -' ? 'text-gray-500' : ''}"
			/>
		</div>
	</div>
</form>
