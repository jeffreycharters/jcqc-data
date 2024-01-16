<script lang="ts">
	import NumberInput from "$lib/components/NumberInput.svelte"
	import TextInput from "$lib/components/TextInput.svelte"
	import type { ElementsResponse } from "$lib/pocketbase-types"
	import { pb } from "$lib/pocketbase"
	import { createEventDispatcher, tick, type EventDispatcher } from "svelte"
	import { z } from "zod"

	let name: string
	let symbol: string
	let mass: number
	let formError = ""

	let symbolInput: HTMLInputElement

	const schema = z.object({
		symbol: z.string().regex(/^[A-Z][a-z]?$/, "Invalid atomic symbol"),
		mass: z.coerce
			.number()
			.min(1, "Mass must be greater than 1")
			.max(250, "Mass must be less than 250")
	})

	const dispatch: EventDispatcher<{ addElement: ElementsResponse }> = createEventDispatcher()

	async function addElement() {
		const fd = schema.safeParse({ name, symbol, mass })

		if (!fd.success) return (formError = fd.error.issues[0].message)
		formError = ""

		const exists = await pb
			.collection("elements")
			.getFirstListItem(`symbol="${symbol}" && mass="${mass}"`)
			.then(() => true)
			.catch(() => false)

		if (exists) return (formError = "Element+Mass already exists")

		pb.collection("elements")
			.create({
				symbol,
				mass,
				active: true
			})
			.then(async (newElement) => {
				dispatch("addElement", newElement as ElementsResponse)
				await tick()
				symbolInput.focus()
			})
			.catch((err) => {
				throw new Error((err as Error).message)
			})

		symbol = ""
		mass = 1
	}
</script>

<div class="w-fit rounded border border-gray-800 p-4 shadow">
	<h2 class="-mt-2">Add Element</h2>

	<form on:submit|preventDefault={addElement}>
		<div class="my-2 flex flex-col text-sm">
			<label for={name}>Chemical Symbol</label>
			<input
				type="text"
				id={name}
				class="text-input"
				bind:value={symbol}
				bind:this={symbolInput}
				placeholder="e.g. Fe"
			/>
		</div>
		<div class="flex max-w-xs items-end justify-between gap-4">
			<NumberInput name="mass" label="Isotope Mass" bind:value={mass} placeholder="e.g. 57" />
			<button type="submit" class="btn mb-2 h-fit">Add</button>
		</div>
		{#if formError}
			<div class="ml-2 text-sm italic text-red-600">{formError}</div>
		{/if}
	</form>
</div>
