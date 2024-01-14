<script lang="ts">
	import NumberInput from "$lib/components/NumberInput.svelte"
	import TextInput from "$lib/components/TextInput.svelte"
	import type { ElementsResponse } from "$lib/pocketbase-types"
	import { pb } from "$lib/pocketbase"
	import { createEventDispatcher, type EventDispatcher } from "svelte"
	import { z } from "zod"

	let name: string
	let symbol: string
	let mass: number
	let formError = ""

	const schema = z.object({
		symbol: z.string().regex(/^[A-Z][a-z]?$/, "Invalid atomic symbol"),
		mass: z.coerce
			.number()
			.min(1, "Mass must be greater than 1")
			.max(150, "Mass must be less than 150")
	})

	const dispatch: EventDispatcher<{ addElement: ElementsResponse }> = createEventDispatcher()

	async function addElement() {
		const fd = schema.safeParse({ name, symbol, mass })

		if (!fd.success) return (formError = fd.error.issues[0].message)
		formError = ""

		const exists = await pb
			.collection("elements")
			.getFirstListItem(`symbol="${symbol}" && mass="${mass}"`)

		if (exists) return (formError = "Element+Mass already exists")

		console.log("creating!")
		pb.collection("elements")
			.create({
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
		mass = 1
	}
</script>

<div class="border border-gray-800 rounded shadow w-fit p-4">
	<h2 class="-mt-2">Add Element</h2>

	<form on:submit|preventDefault={addElement}>
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
