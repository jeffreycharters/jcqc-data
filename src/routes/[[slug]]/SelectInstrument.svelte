<script lang="ts">
	import { browser } from '$app/environment';
	import { instrument, instruments } from '$lib/stores';

	$: selectedInstrument = $instrument;

	if (browser) {
		const serial = localStorage.getItem('instrument');
		if (serial) {
			const savedInstrument = $instruments.find((i) => i.serial === serial);
			if (savedInstrument) $instrument = savedInstrument;
		}
	}

	const saveInstrument = async (index: number) => {
		$instrument = $instruments[index];
		localStorage.setItem('instrument', $instrument.serial);
	};
</script>

<div class="border border-gray-500 rounded w-52 py-2">
	<h2 class="mb-2 text-center">Select Instrument</h2>

	<div class="flex flex-col items-center">
		{#each $instruments || [] as inst, index (inst.id)}
			<button
				class="btn my-2 {$instrument === inst ? 'selected-button' : 'method-button'}"
				on:click={() => saveInstrument(index)}
			>
				{inst.name}
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
