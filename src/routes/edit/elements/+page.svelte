<script lang="ts">
	import { elements } from '$lib/stores';
	import type { PageData } from './$types';
	import AddElementForm from './AddElementForm.svelte';
	import Element from './Element.svelte';

	export let data: PageData;
	elements.set(data.elementList);

	$: retiredElements = $elements.filter((e) => e.retired);
	$: unretiredElements = $elements.filter((e) => !e.retired);
</script>

<h1 class="my-4">Available Elements</h1>

<p class="my-4">
	Inactivating will remove the element <em>across all methods</em>. Maybe you just want to remove
	the element from <a href="/edit">one method</a>?
</p>

<div class="grid grid-cols-5 gap-4">
	{#each unretiredElements as element (element.id)}
		<Element {element} />
	{/each}

	{#each retiredElements as element (element.id)}
		<Element {element} />
	{/each}
	<div class="col-span-3 row-span-2">
		<AddElementForm />
	</div>
</div>
