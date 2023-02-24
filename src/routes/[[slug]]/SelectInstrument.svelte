<script lang="ts">
	import { browser } from '$app/environment';
	import type { InstrumentsResponse } from '$lib/pocketbase-types';
	import { instrument, instruments } from '$lib/stores';
	import { onMount } from 'svelte';

	$: selectedInstrument = $instrument;

	onMount(() => {
		const savedInstrument = localStorage.getItem('instrument') || '';
		if (savedInstrument) {
			$instrument = $instruments.find((i) => i.serial === savedInstrument) ?? $instruments[0];
		}
	});

	const saveInstrument = async (index: number) => {
		$instrument = $instruments[index];
		if (browser) {
			localStorage.setItem('instrument', $instrument.serial);
		}
	};
</script>

<div class="border border-gray-500 rounded w-52 py-2">
	<h2 class="mb-2 text-center">Select Instrument</h2>

	<div class="flex flex-col items-center">
		{#each $instruments || [] as instrument, index (instrument.id)}
			<button
				class="btn my-2 {selectedInstrument === instrument ? 'selected-button' : 'method-button'}"
				on:click={() => saveInstrument(index)}
			>
				{instrument.name}
			</button>{' '}
		{/each}
	</div>
</div>

<style lang="postcss">
	.selected-button {
		@apply text-teal-600 border-teal-700 shadow-sm shadow-teal-700/50 font-semibold;
		box-shadow: '0 0 5px #086077';
	}
</style>
