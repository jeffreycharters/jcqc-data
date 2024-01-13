<script lang="ts">
	import { methods } from "$lib/stores"
	import AddMethodForm from "./AddMethodForm.svelte"
	import MethodCard from "./MethodCard.svelte"
	import { flip } from "svelte/animate"
	import { quintOut } from "svelte/easing"
	import { crossfade } from "svelte/transition"
	import { IconAtom2, IconCookieMan, IconPlaylistAdd } from "@tabler/icons-svelte"

	const [send, receive] = crossfade({
		duration: 250,
		easing: quintOut
	})

	let showAddForm = false
</script>

<h1 class="mt-8 mb-6">Select method to edit</h1>

<div class="grid grid-cols-4 gap-4 max-w-screen-lg">
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
		class="border border-gray-500 w-full p-4 rounded shadow-lg flex gap-2 items-center justify-center font-bold"
	>
		<IconPlaylistAdd class=" h-8 w-8 stroke-[1.5]" />
		Add Method
	</button>
</div>

<AddMethodForm {showAddForm} on:close={() => (showAddForm = false)} />

<h1 class="mt-10 -mb-2">Other options</h1>

<div class="grid grid-cols-4 gap-4 max-w-screen-lg">
	<div class="border border-gray-800 rounded shadow mt-8 w-full h-fit">
		<a href="/edit/elements" class="no-underline py-4 px-6 inline-flex items-center gap-2">
			<IconAtom2 class="rotate-45" />
			<h2>Edit elements</h2>
		</a>
	</div>

	<div class="border border-gray-800 w-full rounded shadow mt-8 h-fit">
		<a href="/" class="no-underline py-4 px-6 inline-flex items-center gap-2">
			<IconCookieMan class="-rotate-12 stroke-amber-700" />
			<h2>Return to Main</h2>
		</a>
	</div>
</div>
