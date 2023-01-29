<script lang="ts">
	import type { Analyte } from '$lib/classes';
	import ElementWithMass from '$lib/components/ElementWithMass.svelte';
	import type { CheckValuesResponse, DetectionLimitsResponse } from '$lib/pocketbase-types';
	import { method } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';

	export let element: Analyte;
	export let checkStandardName: string;
	const dispatch = createEventDispatcher();

	let allCheckValues: CheckValuesResponse[] =
		$method.checkStandards?.get(checkStandardName)?.expand?.checkValues;

	const checkValues =
		allCheckValues?.find((checkValue) => checkValue.element === element.id) ?? undefined;

	let valueBase = checkValues?.value;
	let value = !valueBase || valueBase === 0 ? '- -' : valueBase;

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

	const updateCalCheck = async () => {
		// update database
		await $method.updateCheckStandardValue(checkValues?.id ?? '', Number(value));
		dispatch('updateStatus', 'Saved!');
	};

	const processUpdate = () => debounce(() => updateCalCheck());
</script>

<form class="basic-border flex flex-col pt-2">
	<div class="flex items-center justify-center h-full gap-4">
		<ElementWithMass symbol={element.symbol} mass={element.mass} />
		<span class="text-gray-500">{element.units}</span>
	</div>
	<div class="flex items-center gap-2 justify-center">
		<label for={`${element.id}-mdl`}>Expect:</label>
		<div class="w-16">
			<input
				type="text"
				name={`${element.id}-value`}
				bind:value
				on:keypress={processUpdate()}
				on:focus={() => (value = value === '- -' ? '' : value)}
				on:blur={() => (value = value === '' ? '- -' : value)}
				class="number-input mt-1 mb-2 text-sm text-center {value === '- -' ? 'text-gray-500' : ''}"
			/>
		</div>
	</div>
</form>
