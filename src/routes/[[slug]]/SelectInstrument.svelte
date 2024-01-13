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

<div class="border border-gray-500 rounded w-52 py-2">
	<h2 class="mb-2 text-center">Instruments</h2>

	<div class="flex gap-4 justify-center">
		{#each $instruments || [] as instrument (instrument.id)}
			<button
				class="btn {$instrumentStore?.id === instrument.id ? 'selected-button' : 'method-button'}"
				on:click={() => saveInstrument(instrument)}
			>
				{instrument.name}
			</button>
		{/each}
	</div>
</div>

<style lang="postcss">
	.selected-button {
		@apply text-sky-600 border-sky-700 shadow-sm shadow-sky-700/50 font-semibold;
		box-shadow: "0 0 5px #086077";
	}
</style>
