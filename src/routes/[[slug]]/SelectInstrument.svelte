<script lang="ts">
	import { instrument } from '$lib/stores';

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
</script>

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

<style lang="postcss">
	.selected-button {
		@apply text-teal-600 border-teal-700 shadow-sm shadow-teal-700/50 font-semibold;
		box-shadow: '0 0 5px #086077';
	}
</style>
