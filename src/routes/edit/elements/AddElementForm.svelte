<script lang="ts">
	import NumberInput from "$lib/components/NumberInput.svelte"
	import { db } from "$lib/db"
	import { getEditableElementsContext, getElementsContext } from "$lib/storage"
	import { tick } from "svelte"
	import { z } from "zod"

	const elements = getElementsContext()
	const editableList = getEditableElementsContext()

	let name: string
	let symbol: string
	let mass: number | undefined
	let formError = ""

	let symbolInput: HTMLInputElement

	const schema = z.object({
		symbol: z.string().regex(/^[A-Z][a-z]?$/, "Invalid atomic symbol"),
		mass: z.coerce
			.number()
			.min(1, "Mass must be greater than 1")
			.max(250, "Mass must be less than 250")
	})

	async function addElement() {
		const fd = schema.safeParse({ name, symbol, mass })

		if (!fd.success) return (formError = fd.error.issues[0].message)
		formError = ""

		const exists = (await db.elements.where({ symbol, mass }).count()) > 0

		if (exists) return (formError = "Element+Mass already exists")

		const newElement = {
			id: `${symbol}${mass}`,
			symbol: fd.data.symbol,
			mass: fd.data.mass,
			active: true
		}

		db.elements
			.add(newElement)
			.then(async () => {
				$elements = [...($elements ?? []), newElement]
				$editableList = [...($editableList ?? []), newElement.id]
				await tick()
				symbolInput.focus()
			})
			.catch((err) => {
				throw new Error((err as Error).message)
			})

		symbol = ""
		mass = undefined
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
