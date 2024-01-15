<script lang="ts">
	import { allElements, methodElementsStore } from "$lib/stores"
	import { flip } from "svelte/animate"
	import { crossfade, fade, slide } from "svelte/transition"
	import ActiveElement from "./ActiveElement.svelte"
	import InactiveElement from "./InactiveElement.svelte"
	import { derived } from "svelte/store"
	// @ts-expect-error
	import IconAtom2Filled from "@tabler/icons-svelte/dist/svelte/icons/IconAtom2Filled.svelte"
	// @ts-expect-error
	import IconChevronsRight from "@tabler/icons-svelte/dist/svelte/icons/IconChevronsRight.svelte"
	// @ts-expect-error
	import IconX from "@tabler/icons-svelte/dist/svelte/icons/IconX.svelte"

	let formMessage: string | undefined = undefined
	let open = false

	const usedElementIDs = derived(methodElementsStore, ($methodElementsStore) =>
		($methodElementsStore ?? []).map((methodElement) => methodElement.elementID)
	)

	const [send, receive] = crossfade({ duration: 200 })
</script>

<div class="basic-border my-4 w-full bg-stone-100">
	<div class="flex items-end gap-4">
		<button class="flex w-full items-center gap-2 px-8 py-4" on:click={() => (open = !open)}>
			<IconChevronsRight class="h-5 w-5 stroke-gray-400 transition-all {open ? 'rotate-90' : ''}" />

			<h2 class="inline-flex gap-4 whitespace-nowrap">
				Add/Remove elements
				<span class="flex items-center font-semibold text-gray-400">
					<IconAtom2Filled class="h-6 w-6" />
					<IconX class="mx-1 h-3 w-3"></IconX>
					{$methodElementsStore?.length != undefined ? $methodElementsStore?.length : 0}</span
				>
			</h2>
		</button>
		{#if formMessage}
			<div
				class="w-36 text-center text-sm italic tracking-wide text-amber-600"
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 100 }}
			>
				{formMessage}
			</div>
		{/if}
	</div>

	{#if open}
		<div class="mx-8 mb-8 grid grid-cols-8 gap-4" transition:slide={{ duration: 200 }}>
			{#each ($methodElementsStore ?? []).sort((a, b) => a.mass - b.mass) as methodElement (methodElement.id)}
				<div
					class="col-span-2"
					in:receive|local={{ key: methodElement.elementID }}
					out:send|local={{ key: methodElement.elementID }}
					animate:flip={{ duration: 200 }}
				>
					<ActiveElement {methodElement} />
				</div>
			{/each}

			{#each ($allElements ?? [])
				.filter((e) => !$usedElementIDs.includes(e.id))
				.sort((a, b) => a.mass - b.mass) as element (element.id)}
				<div
					in:receive|local={{ key: element.id }}
					out:send|local={{ key: element.id }}
					animate:flip={{ duration: 200 }}
				>
					<InactiveElement {element} />
				</div>
			{/each}
		</div>
	{/if}
</div>
