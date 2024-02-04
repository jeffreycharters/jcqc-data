<script lang="ts">
	import { getInstrumentContext, getInstrumentsContext } from "$lib/storage"

	const instruments = getInstrumentsContext()
	const selectedInstrument = getInstrumentContext()

	const saveInstrument = async (instrumentID: string) => {
		localStorage.setItem("instrument", instrumentID)
		$selectedInstrument = instrumentID
	}
</script>

<div class="flex h-fit w-fit flex-col gap-2 rounded border border-gray-500 p-2">
	<h2 class="text-center">Instruments</h2>

	<div class="flex justify-center gap-4">
		{#each $instruments ?? [] as instrument_i (instrument_i.id)}
			<button
				class="btn whitespace-nowrap {$selectedInstrument === instrument_i.id
					? 'selected-button'
					: 'method-button'}"
				on:click={() => saveInstrument(instrument_i.id)}
			>
				{instrument_i.name}
			</button>
		{/each}
	</div>
</div>

<style lang="postcss">
	.selected-button {
		@apply border-sky-700 font-semibold text-sky-600 shadow-sm shadow-sky-700/50;
		box-shadow: "0 0 5px #086077";
	}
</style>
