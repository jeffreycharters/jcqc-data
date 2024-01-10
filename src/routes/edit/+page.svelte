<script lang="ts">
	import { methods } from "$lib/stores"
	import AddMethodForm from "./AddMethodForm.svelte"
	import MethodCard from "./MethodCard.svelte"
	import { flip } from "svelte/animate"
	import { quintOut } from "svelte/easing"
	import { crossfade } from "svelte/transition"
	import { IconPlaylistAdd } from "@tabler/icons-svelte"

	const [send, receive] = crossfade({
		duration: 250,
		easing: quintOut
	})

	let showAddForm = true
</script>

<h1 class="my-8">Select Method</h1>

<div class="list-grid-container">
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

<div class="border border-gray-800 py-4 px-6 w-fit rounded shadow mt-8">
	<a href="/edit/elements">
		<h2>Add, update or remove elements</h2>
	</a>
</div>

<p class="mt-8"><a href="/">Back to main</a></p>
