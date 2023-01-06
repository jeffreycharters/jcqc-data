<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { ElementsResponse } from '$lib/pocketbase-types';
	import { elements } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let element: ElementsResponse;
	let { name, symbol, mass } = element;

	let formMessage: string;

	const addFormMessage = (message: string, timeout: number = 3000) => {
		formMessage = message;
		setTimeout(() => (formMessage = ''), timeout);
	};

	$: data = {
		name,
		symbol,
		mass
	} satisfies Record<string, string | number>;

	let editing = false;

	async function saveChanges() {
		const updatedElement: ElementsResponse = await pb
			.collection('elements')
			.update(element.id, JSON.stringify(data));
		elements.update((n) => {
			let listElement = n.find((e) => e.id === updatedElement.id);
			if (!listElement) return n;
			listElement.mass = mass;
			listElement.symbol = symbol;
			listElement.name = name;
			return n;
		});
		editing = false;
		addFormMessage('Saved!');
	}
</script>

{#if editing}
	<div>
		<form>
			<label for="name">Name:</label>
			<input type="text" name="name" bind:value={name} />
			<label for="name">Symbol:</label>
			<input type="text" name="symbol" bind:value={symbol} />
			<label for="name">Mass:</label>
			<input type="number" name="mass" bind:value={mass} />
			<button type="submit" on:click|preventDefault={saveChanges}>Save Changes</button>
			<button on:click={() => (editing = false)}>Cancel</button>
		</form>
	</div>
{:else}
	<div>
		{element.name}
		{element.symbol}: {element.mass}
		<button on:click={() => (editing = true)}>Edit</button>
		<button on:click={() => dispatch('toggleRetire')}
			>{element.retired ? 'Unretire' : 'Retire'}</button
		>
		{formMessage ?? ''}
	</div>
{/if}
