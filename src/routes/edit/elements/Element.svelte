<script lang="ts">
	import NumberInput from "$lib/components/NumberInput.svelte"
	import TextInput from "$lib/components/TextInput.svelte"
	import { pb } from "$lib/pocketbase"
	import type { ElementsResponse } from "$lib/pocketbase-types"
	import { createEventDispatcher, type EventDispatcher } from "svelte"
	import { fade } from "svelte/transition"

	export let element: ElementsResponse
	let { name, symbol, mass } = element

	let formMessage: string

	const dispatch: EventDispatcher<{ toggleActive: ElementsResponse }> = createEventDispatcher()

	const addFormMessage = (message: string, timeout: number = 2000) => {
		formMessage = message
		setTimeout(() => (formMessage = ""), timeout)
	}

	let editing = false

	async function saveChanges() {
		if (!name || !symbol || !mass) {
			addFormMessage("Input missing data")
			return
		}

		pb.collection("elements")
			.update(element.id, {
				name,
				symbol,
				mass
			})
			.then(() => {
				editing = false
				addFormMessage("Saved!")
			})
			.catch((err) => {
				addFormMessage("Save failed")
				console.error((err as Error).message)
			})
	}

	async function toggleElementActive() {
		pb.collection("elements")
			.update(element.id, {
				active: !element.active
			})
			.then((updated) => {
				dispatch("toggleActive", updated as ElementsResponse)
			})
			.catch((err) => {
				throw new Error(err)
			})
	}
</script>

<div
	class="element {editing ? 'row-span-2' : ''} {element.active ? 'active' : 'inactive'} relative"
>
	{#if editing}
		<form on:submit|preventDefault={saveChanges}>
			<TextInput name="name" label="Element Name" bind:value={name} />
			<TextInput name="symbol" label="Chemical Symbol" bind:value={symbol} />
			<NumberInput name="mass" label="Isotope Mass" bind:value={mass} />

			<div class="flex justify-between items-center mt-4">
				<button class="btn text-sm" type="submit">Save Changes</button>
				<button type="button" class="text-sm ml-2" on:click={() => (editing = false)}>Cancel</button
				>
			</div>

			<div class="ml-1 text-sm text-red-600">
				{formMessage ?? ""}
			</div>
		</form>
	{:else}
		<div class="flex flex-col">
			<div>
				<sup>{mass}</sup>{symbol}
			</div>
			<button class="inactivate-button" on:click={toggleElementActive}
				>{element.active ? "Inactivate" : "Activate"}</button
			>
		</div>
		{#if !element.active}
			<div class="w-12" />
		{:else}
			<div>
				<button class="btn" on:click={() => (editing = true)}>Edit</button>
				{#if formMessage}
					<div
						transition:fade|local={{ duration: 100 }}
						class="text-sm text-green-700 absolute -bottom-2 right-2 bg-white rounded border-gray-600 px-2 border"
					>
						{formMessage}
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style lang="postcss">
	.element {
		@apply border rounded shadow py-2 px-4 flex items-center justify-around;
	}
	.active {
		@apply border-gray-800;
	}
	.inactive {
		@apply border-gray-300 text-gray-400;
	}
</style>
