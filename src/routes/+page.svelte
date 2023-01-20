<script lang="ts">
	import { instrument, selectedMethodId } from '$lib/stores';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import FilePicker from './FilePicker.svelte';
	import MethodParams from './MethodParams.svelte';

	export let data: PageData;
	const { methods } = data;

	const instruments: Instrument[] = [
		{ name: 'Agilent 7900-1', serial: 'JP20174833' },
		{ name: 'Agilent 7900-2', serial: 'SG20174834' }
	];

	const saveInstrument = async (index: number) => {
		console.log('saving instrument as', index);
		$instrument = instruments[index];
		selectedInstrument = index;
	};

	let selectedInstrument = 0;
	let selectedMethod: number | undefined = 0;

	const setMethod = (index: number | undefined) => {
		if (index != undefined) $selectedMethodId = methods[index].id ?? '';
		else $selectedMethodId = '';
		selectedMethod = index;
	};
</script>

<div class="absolute bottom-4 left-4">
	<a class="no-underline btn" href="/edit">Edit stuff</a>
</div>

<div class="p-4">
	<div class="align-center">
		<h1 class="text-2xl w-fit mx-auto">JCQC Reporting Application</h1>
		<hr class="w-[36rem] my-4 mx-auto" />
		<div
			class="flex w-[800px] mx-auto justify-between place-items-stretch 
        "
		>
			<div class="border border-gray-500 rounded w-52 py-2">
				<h2 class="mb-2 text-center">Select Instrument</h2>

				<div class="flex flex-col items-center">
					{#each instruments as instrument, index (instrument.serial)}
						<button
							class="btn my-2 {selectedInstrument === index ? 'selected-button' : 'method-button'}"
							on:click={() => saveInstrument(index)}
						>
							{instrument.name}
						</button>{' '}
					{/each}
				</div>
			</div>

			<div class="border border-gray-500 rounded w-[36rem] py-2">
				<h2 class="mb-2 text-center">Select Method</h2>

				<div class="flex flex-wrap justify-center mx-auto gap-3">
					{#each methods as method, index (method.id)}
						<button
							on:click={() => setMethod(index)}
							class="btn my-2 {selectedMethod === index ? 'selected-button' : 'method-button'}"
							>{method.name}</button
						>
					{/each}
					<button class="btn my-2 method-button" on:click={() => setMethod(undefined)}>Clear</button
					>
				</div>
			</div>
		</div>

		{#if selectedMethod != undefined}
			<div class="my-8" in:fade={{ duration: 200 }}>
				<FilePicker />
			</div>

			<MethodParams methodId={methods[selectedMethod].id} />
		{/if}
	</div>
</div>

<style lang="postcss">
	.selected-button {
		@apply text-teal-600 border-teal-700 shadow-sm shadow-teal-700/50 font-semibold;
		box-shadow: '0 0 5px #086077';
	}

	.method-button {
		@apply text-gray-600 border-gray-700 scale-95 transition-all;
	}
</style>
