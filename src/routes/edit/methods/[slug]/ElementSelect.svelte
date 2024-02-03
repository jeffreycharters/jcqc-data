<script lang="ts">
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
	import { getElementsContext, getMethodElementsContext } from "$lib/storage"

	let formMessage: string | undefined = undefined
	let open = false

	const elements = getElementsContext()
	const methodElements = getMethodElementsContext()

	const usedElementIDs = derived(methodElements, ($methodElements) =>
		($methodElements ?? []).map((methodElement) => methodElement.element)
	)
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
					{$methodElements?.length != undefined ? $methodElements?.length : 0}</span
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
		<div
			class="mx-8 mb-8 grid grid-cols-4 items-stretch gap-4"
			transition:slide={{ duration: 200 }}
		>
			{#each ($elements ?? []).sort((a, b) => a.mass - b.mass) as element (element.id)}
				{#if $usedElementIDs.includes(element.id)}
					<ActiveElement id={element.id} />
				{:else}
					<InactiveElement {element} />
				{/if}
			{/each}
		</div>
	{/if}
</div>
