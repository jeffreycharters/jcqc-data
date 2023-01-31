<script lang="ts">
	import { methods, showAddForm } from '$lib/stores';
	import { onDestroy } from 'svelte';
	import AddMethodCard from './AddMethodCard.svelte';
	import AddMethodForm from './AddMethodForm.svelte';
	import MethodCard from './MethodCard.svelte';

	$: activeMethods = $methods.filter((method) => method.active);
	$: inactiveMethods = $methods.filter((method) => !method.active);

	const closeAddFormIfNecessary = (event: KeyboardEvent) => {
		if (showAddForm && event.code === 'Escape') $showAddForm = false;
	};

	onDestroy(() => {
		$showAddForm = false;
	});
</script>

<svelte:window on:keydown={closeAddFormIfNecessary} />

<h1 class="my-8">Select Method</h1>

<div class="list-grid-container">
	{#each activeMethods as method (method.id)}
		<MethodCard {method} />
	{/each}
	<AddMethodCard on:toggleAddForm={() => ($showAddForm = !$showAddForm)} />
	{#each inactiveMethods as method (method.id)}
		<MethodCard {method} />
	{/each}
</div>

<AddMethodForm on:close={() => ($showAddForm = false)} />

<div class="border border-gray-800 py-4 px-6 w-fit rounded shadow mt-8">
	<a href="/edit/elements">
		<h2>Add, update or remove elements</h2>
	</a>
</div>

<p class="mt-8"><a href="/">Back to main</a></p>
