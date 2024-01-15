<script lang="ts">
	import NumberInput from "$lib/components/NumberInput.svelte"
	import TextInput from "$lib/components/TextInput.svelte"
	import { pb } from "$lib/pocketbase"
	import type { ElementsResponse } from "$lib/pocketbase-types"
	import { createEventDispatcher, type EventDispatcher } from "svelte"
	import { fade } from "svelte/transition"
	import { z } from "zod"
	import { IconEdit } from "@tabler/icons-svelte"
	import { createTooltip, melt } from "@melt-ui/svelte"

	export let editable: boolean = false
	export let element: ElementsResponse
	let { symbol, mass } = element

	let formMessage: string

	const schema = z.object({
		symbol: z.string().regex(/^[A-Z][a-z]?$/, "Invalid atomic symbol"),
		mass: z.coerce
			.number()
			.min(1, "Mass must be greater than 1")
			.max(250, "Mass must be less than 250")
	})

	const dispatch: EventDispatcher<{ toggleActive: ElementsResponse }> = createEventDispatcher()

	const addFormMessage = (message: string, timeout: number = 2000) => {
		formMessage = message
		setTimeout(() => (formMessage = ""), timeout)
	}

	let editing = false

	const {
		elements: { trigger, content, arrow },
		states: { open }
	} = createTooltip({
		positioning: {
			placement: "top"
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: true
	})

	async function saveChanges() {
		const fd = schema.safeParse({ symbol, mass })
		if (!fd.success) return addFormMessage(fd.error.issues[0].message)

		let exists = await pb
			.collection("elements")
			.getFirstListItem(`symbol="${symbol}"&&mass="${mass}"&&id!="${element.id}"`)
			.then((_) => {
				return true
			})
			.catch((err) => {
				if (!(err as Error).message.includes("wasn't found")) throw err
				return false
			})

		if (exists) {
			return addFormMessage("Element+Mass already exists")
		}

		pb.collection("elements")
			.update(element.id, {
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
	class="flex items-center justify-around rounded border px-4 py-2 shadow {element.active
		? 'active'
		: 'inactive'}"
	class:row-span-2={editing}
>
	{#if editing}
		<form on:submit|preventDefault={saveChanges} class="w-full">
			<TextInput name="symbol" label="Chemical Symbol" bind:value={symbol} />
			<NumberInput name="mass" label="Isotope Mass" bind:value={mass} />

			<div class="mt-4 flex items-center justify-between">
				<button class="btn text-sm" type="submit">Save</button>
				<button type="button" class="ml-2 text-sm" on:click={() => (editing = false)}>Cancel</button
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
			<button
				use:melt={$trigger}
				aria-label="editing disallowed for element in use by a method"
				class="btn flex items-center gap-1 disabled:border-stone-300 disabled:text-stone-400"
				on:click={() => editable && (editing = true)}
				disabled={!editable}
			>
				<IconEdit class="h-4 w-4" />
				Edit
			</button>
			{#if $open && !editable}
				<div
					use:melt={$content}
					transition:fade={{ duration: 100 }}
					class="z-10 rounded bg-stone-100 shadow-lg"
				>
					<div use:melt={$arrow} />
					<p class="px-4 py-1 text-stone-700">Element is in use</p>
				</div>
			{/if}
			{#if formMessage}
				<div
					transition:fade|local={{ duration: 200 }}
					class="absolute -bottom-2 right-2 rounded border border-gray-600 bg-white px-2 text-sm text-green-700"
				>
					{formMessage}
				</div>
			{/if}
		{/if}
	{/if}
</div>

<style lang="postcss">
	.active {
		@apply border-gray-800;
	}
	.inactive {
		@apply border-gray-300 text-gray-400;
	}
</style>
