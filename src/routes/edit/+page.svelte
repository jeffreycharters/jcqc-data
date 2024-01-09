<script lang="ts">
	import { methods, showAddForm } from "$lib/stores"
	import { onDestroy } from "svelte"
	import AddMethodCard from "./AddMethodCard.svelte"
	import AddMethodForm from "./AddMethodForm.svelte"
	import MethodCard from "./MethodCard.svelte"
	import { flip } from "svelte/animate"
	import { quintOut } from "svelte/easing"
	import { crossfade } from "svelte/transition"

	const [send, receive] = crossfade({
		duration: 250,
		easing: quintOut
	})

	const closeAddFormIfNecessary = (event: KeyboardEvent) => {
		if (showAddForm && event.code === "Escape") $showAddForm = false
	}

	onDestroy(() => {
		$showAddForm = false
	})
</script>

<svelte:window on:keydown={closeAddFormIfNecessary} />

<h1 class="my-8">Select Method</h1>

<div class="list-grid-container">
	{#each $methods.filter((method) => method.active) as method (method.id)}
		<div
			animate:flip={{ duration: 250 }}
			in:send={{ key: method.id }}
			out:receive={{ key: method.id }}
		>
			<MethodCard {method} />
		</div>
	{/each}
	{#each $methods.filter((method) => !method.active) as method (method.id)}
		<div
			animate:flip={{ duration: 250 }}
			in:send={{ key: method.id }}
			out:receive={{ key: method.id }}
		>
			<MethodCard {method} />
		</div>
	{/each}
	<AddMethodCard on:toggleAddForm={() => ($showAddForm = !$showAddForm)} />
</div>

<AddMethodForm on:close={() => ($showAddForm = false)} />

<div class="border border-gray-800 py-4 px-6 w-fit rounded shadow mt-8">
	<a href="/edit/elements">
		<h2>Add, update or remove elements</h2>
	</a>
</div>

<p class="mt-8"><a href="/">Back to main</a></p>
