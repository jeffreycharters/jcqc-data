<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { ElementsResponse } from '$lib/pocketbase-types';
	import { elements } from '$lib/stores';
	import type { PageData } from './$types';
	import Element from './Element.svelte';

	export let data: PageData;
	elements.set(data.elementList);

	let name: string;
	let symbol: string;
	let mass: number | undefined;

	let formError: string;

	$: retiredElements = $elements.filter((e) => e.retired);
	$: unretiredElements = $elements.filter((e) => !e.retired);

	const addElement = async () => {
		if (!name || !symbol || !mass) formError = 'Missing something';
		const data = JSON.stringify({
			name,
			symbol,
			mass
		});
		try {
			const newElement: ElementsResponse = await pb.collection('elements').create(data);
			elements.update((n) => {
				const newList = [...n, newElement];
				newList.sort((a, b) => (a.mass < b.mass ? -1 : 1));
				return newList;
			});
			name = '';
			symbol = '';
			mass = undefined;
		} catch (err) {
			const error = err as Error;
			console.log(error);
		}
	};

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

<h2>Add new</h2>

<form on:submit|preventDefault={addElement}>
	<div>
		<label for="name">Full name</label>
		<input type="text" name="name" placeholder="e.g. Iron" bind:value={name} />
	</div>
	<div>
		<label for="symbol">Symbol</label>
		<input type="text" name="symbol" placeholder="e.g. Fe" bind:value={symbol} />
	</div>
	<div>
		<label for="mass">Mass/Isotope</label>
		<input type="number" name="mass" placeholder="e.g. 57" min="1" max="225" bind:value={mass} />
	</div>
	<input type="submit" value="Add element" />
	{#if formError}
		<div style="color: darkred">{formError}</div>
	{/if}
</form>

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
