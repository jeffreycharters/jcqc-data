<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { ElementsResponse } from '$lib/pocketbase-types';
	import { elements } from '$lib/stores';
	import type { PageData } from './$types';
	import AddElementForm from './AddElementForm.svelte';
	import Element from './Element.svelte';

	export let data: PageData;
	elements.set(data.elementList);

	$: retiredElements = $elements.filter((e) => e.retired);
	$: unretiredElements = $elements.filter((e) => !e.retired);

	const toggleElementRetired = async (element: ElementsResponse) => {
		const data = JSON.stringify({
			retired: !element.retired
		});
		const updatedElement = await pb.collection('elements').update(element.id, data);
		elements.update((n) => {
			const selectedElement = n.find((e) => e.id === updatedElement.id);
			if (selectedElement) {
				selectedElement.retired = updatedElement.retired;
			}
			return n;
		});
	};
</script>

<h1>Editing Available Elements</h1>

<h2>Available Elements</h2>
{#each unretiredElements as element (element.id)}
	<Element {element} on:toggleRetire={() => toggleElementRetired(element)} />
{/each}

<h2>Retired Elements</h2>
{#each retiredElements as element (element.id)}
	<div>
		{element.name}
		{element.symbol}: {element.mass}
		<button on:click={() => toggleElementRetired(element)}
			>{element.retired ? 'Unretire' : 'Retire'}</button
		>
	</div>
{/each}

<div class="mt-6">
	<AddElementForm />
</div>
