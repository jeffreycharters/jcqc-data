<script lang="ts">
	import { setInstrumentsContext } from "$lib/storage"
	import AddInstrumentForm from "../AddInstrumentForm.svelte"
	import type { PageData } from "./$types"
	import InstrumentCard from "./InstrumentCard.svelte"

	export let data: PageData
	const instruments = setInstrumentsContext(data.instrumentList ?? [])

	let showAddInstrumentForm = false

	// @ts-expect-error bluh
	import IconBatteryAutomotive from "@tabler/icons-svelte/dist/svelte/icons/IconBatteryAutomotive.svelte"
</script>

<h1 class="mb-6 mt-8">Edit Instruments</h1>
<div class="grid max-w-screen-lg grid-cols-2 gap-4">
	{#each $instruments ?? [] as instrument (instrument.id)}
		<InstrumentCard {instrument} />
	{/each}

	<button
		on:click={() => (showAddInstrumentForm = !showAddInstrumentForm)}
		class="flex w-full items-center justify-center gap-2 rounded border border-gray-500 p-4 font-bold shadow-lg"
	>
		<IconBatteryAutomotive class=" h-6 w-6 stroke-[1.5]" />
		Add Instrument
	</button>
</div>

<AddInstrumentForm show={showAddInstrumentForm} on:close={() => (showAddInstrumentForm = false)} />
