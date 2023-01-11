<script lang="ts">
	import { methods } from '$lib/stores';
	import type { PageData } from './$types';
	import AddMethodCard from './AddMethodCard.svelte';
	import AddMethodForm from './AddMethodForm.svelte';
	import MethodCard from './MethodCard.svelte';

	export let data: PageData;

	let showAddForm = false;

	methods.set(data.methodList);

	$: activeMethods = $methods.filter((e) => e.active);
	$: inactiveMethods = $methods.filter((e) => !e.active);
</script>

<h1 class="mb-4">Select Method</h1>

<div class="grid grid-cols-4 gap-4">
	{#each activeMethods as method (method.id)}
		<MethodCard {method} />
	{/each}
	<AddMethodCard on:showAddForm={() => (showAddForm = true)} />
	{#each inactiveMethods as method (method.id)}
		<MethodCard {method} />
	{/each}
</div>

{#if showAddForm}
	<AddMethodForm on:close={() => (showAddForm = false)} />
{/if}

<h2>Add, update or remove</h2>

<div class="flex gap-4 border-b border-black w-fit pb-2">
	<a href="/edit/elements">Elements</a>
	<a href="/edit/reference-materials">Reference Materials</a>
</div>

<p class="mt-8"><a href="/">Back to main</a></p>
