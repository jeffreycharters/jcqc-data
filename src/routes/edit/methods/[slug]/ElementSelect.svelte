<script lang="ts">
	import type { ElementsResponse } from "$lib/pocketbase-types"
	import { allElements, method } from "$lib/stores"
	import { flip } from "svelte/animate"
	import { quintOut } from "svelte/easing"
	import { crossfade, fade, slide } from "svelte/transition"
	import ActiveElement from "./ActiveElement.svelte"
	import InactiveElement from "./InactiveElement.svelte"
	import { IconAtom2Filled, IconChevronsRight, IconX } from "@tabler/icons-svelte"

	let formMessage: string | undefined = undefined
	let open = false

	const [send, receive] = crossfade({ duration: 200 })
</script>

<div class="basic-border my-4 w-full bg-stone-100">
	<div class="flex items-end gap-4">
		<button class="flex gap-2 items-center px-8 py-4 w-full" on:click={() => (open = !open)}>
			<IconChevronsRight class="h-5 w-5 stroke-gray-400 transition-all {open ? 'rotate-90' : ''}" />

			<h2 class="inline-flex whitespace-nowrap gap-4">
				Add/Remove elements
				<span class="text-gray-400 flex items-center font-semibold">
					<IconAtom2Filled class="w-6 h-6" />
					<IconX class="w-3 h-3 mx-1"></IconX>
					{$method?.elements?.length != undefined ? $method?.elements?.length : 0}</span
				>
			</h2>
		</button>
		{#if formMessage}
			<div
				class="text-sm text-amber-600 italic tracking-wide w-36 text-center"
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 100 }}
			>
				{formMessage}
			</div>
		{/if}
	</div>

	{#if open}
		<div class="grid grid-cols-8 gap-4 my-4 mx-8" transition:slide={{ duration: 200 }}>
			{#each $allElements
				.filter((e) => $method?.elements.includes(e.id))
				.sort((a, b) => (a.mass < b.mass ? -1 : 1)) as element (element.id)}
				<div
					class="col-span-2"
					in:receive|local={{ key: element.id }}
					out:send|local={{ key: element.id }}
					animate:flip={{ duration: 200 }}
				>
					<ActiveElement {element} />
				</div>
			{/each}

			{#each $allElements
				.filter((e) => !$method?.elements.includes(e.id))
				.sort((a, b) => (a.mass < b.mass ? -1 : 1)) as element (element.id)}
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
