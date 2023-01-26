<script lang="ts">
	import { methods, showAddForm } from '$lib/stores';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import AddMethodCard from './AddMethodCard.svelte';
	import AddMethodForm from './AddMethodForm.svelte';
	import MethodCard from './MethodCard.svelte';

	export let data: PageData;

	$methods = data.methodList;

	$: activeMethods = $methods.filter((e) => e.active);
	$: inactiveMethods = $methods.filter((e) => !e.active);

	const closeAddFormIfNecessary = (event: KeyboardEvent) => {
		if ($showAddForm && event.code === 'Escape') $showAddForm = false;
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
	<h2>Add, update or remove</h2>

	<div class="flex gap-8 w-fit font-bold text-gray-600 my-2">
		<a href="/edit/elements">Elements</a>
		<a href="/edit/reference-materials">Reference Materials</a>
	</div>
</div>

<p class="mt-8"><a href="/">Back to main</a></p>
