<script lang="ts">
	import type { InstrumentsResponse } from "$lib/pocketbase-types"
	import { instrumentStore, instruments } from "$lib/stores"
	import { onMount } from "svelte"

	onMount(() => {
		const id = localStorage.getItem("instrument")
		if (id) {
			const savedInstrument = $instruments?.find((i) => i.id === id)
			if (savedInstrument) $instrumentStore = savedInstrument
		}
	})

	const saveInstrument = async (instrument: InstrumentsResponse) => {
		$instrumentStore = instrument
		localStorage.setItem("instrument", instrument.id)
	}
</script>

<div class="flex h-fit w-fit flex-col gap-2 rounded border border-gray-500 p-2">
	<h2 class="text-center">Instruments</h2>

	<div class="flex justify-center gap-4">
		{#each $instruments || [] as instrument (instrument.id)}
			<button
				class="btn whitespace-nowrap {$instrumentStore?.id === instrument.id
					? 'selected-button'
					: 'method-button'}"
				on:click={() => saveInstrument(instrument)}
			>
				{instrument.name}
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
