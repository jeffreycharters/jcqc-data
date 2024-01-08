<script lang="ts">
	import NumberInput from "$lib/components/NumberInput.svelte"
	import TextInput from "$lib/components/TextInput.svelte"
	import type { ElementsResponse } from "$lib/pocketbase-types"
	import { pb } from "$lib/pocketbase"
	import { createEventDispatcher, type EventDispatcher } from "svelte"

	let name: string
	let symbol: string
	let mass: number
	let formError = ""

	const dispatch: EventDispatcher<{ addElement: ElementsResponse }> = createEventDispatcher()

	const addElement = async () => {
		if (!name || !symbol || !mass) formError = "Please complete all fields."
		pb.collection("elements")
			.create({
				name,
				symbol,
				mass,
				active: true
			})
			.then((newElement) => {
				dispatch("addElement", newElement as ElementsResponse)
			})
			.catch((err) => {
				throw new Error((err as Error).message)
			})
		name = ""
		symbol = ""
		mass = 0
	}
</script>

<div class="border border-gray-800 rounded shadow w-fit p-4">
	<h2 class="-mt-2">Add Element</h2>

	<form on:submit|preventDefault={addElement}>
		<TextInput name="name" label="Element Name" bind:value={name} placeholder="e.g. Iron" />
		<TextInput name="symbol" label="Chemical Symbol" bind:value={symbol} placeholder="e.g. Fe" />
		<div class="flex items-end justify-between max-w-xs gap-4">
			<NumberInput name="mass" label="Isotope Mass" bind:value={mass} placeholder="e.g. 57" />
			<button type="submit" class="btn h-fit mb-2">Add</button>
		</div>
		{#if formError}
			<div class="text-red-600 text-sm italic ml-2">{formError}</div>
		{/if}
	</form>
</div>
