<script lang="ts">
	import { methods } from "$lib/stores"
	import AddMethodForm from "./AddMethodForm.svelte"
	import MethodCard from "./MethodCard.svelte"
	import { flip } from "svelte/animate"
	import { quintOut } from "svelte/easing"
	import { crossfade } from "svelte/transition"

	// @ts-expect-error
	import IconAtom2 from "@tabler/icons-svelte/dist/svelte/icons/IconAtom2.svelte"
	// @ts-expect-error
	import IconCookieMan from "@tabler/icons-svelte/dist/svelte/icons/IconCookieMan.svelte"
	// @ts-expect-error
	import IconPlaylistAdd from "@tabler/icons-svelte/dist/svelte/icons/IconPlaylistAdd.svelte"

	const [send, receive] = crossfade({
		duration: 250,
		easing: quintOut
	})

	let showAddForm = false
</script>

<h1 class="mb-6 mt-8">Select method to edit</h1>

<div class="grid max-w-screen-lg grid-cols-3 gap-4">
	{#each ($methods ?? []).filter((method) => method.active) as method (method.id)}
		<div
			animate:flip={{ duration: 250 }}
			in:send={{ key: method.id }}
			out:receive={{ key: method.id }}
		>
			<MethodCard {method} />
		</div>
	{/each}
	{#each ($methods ?? []).filter((method) => !method.active) as method (method.id)}
		<div
			animate:flip={{ duration: 250 }}
			in:send={{ key: method.id }}
			out:receive={{ key: method.id }}
		>
			<MethodCard {method} />
		</div>
	{/each}

	<button
		on:click={() => (showAddForm = !showAddForm)}
		class="flex w-full items-center justify-center gap-2 rounded border border-gray-500 p-4 font-bold shadow-lg"
	>
		<IconPlaylistAdd class=" h-8 w-8 stroke-[1.5]" />
		Add Method
	</button>
</div>

<AddMethodForm {showAddForm} on:close={() => (showAddForm = false)} />

<h1 class="-mb-2 mt-10">Other options</h1>

<div class="grid max-w-screen-lg grid-cols-4 gap-4">
	<div class="mt-8 h-fit w-full rounded border border-gray-800 shadow">
		<a href="/edit/elements" class="inline-flex items-center gap-2 px-6 py-4 no-underline">
			<IconAtom2 class="rotate-45" />
			<h2>Edit elements</h2>
		</a>
	</div>

	<div class="mt-8 h-fit w-full rounded border border-gray-800 shadow">
		<a href="/" class="inline-flex items-center gap-2 px-6 py-4 no-underline">
			<IconCookieMan class="-rotate-12 stroke-amber-700" />
			<h2>Return to Main</h2>
		</a>
	</div>
</div>
