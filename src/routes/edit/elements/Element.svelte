<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { ElementsResponse } from '$lib/pocketbase-types';
	import { elements } from '$lib/stores';

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

	let divClass = element.retired ? 'inactive-element' : 'active-element';

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

	const toggleElementRetired = async () => {
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

<div class={divClass}>
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
				<button on:click={toggleElementRetired}>Cancel</button>
			</form>
		</div>
	{:else}
		<div class="flex flex-col">
			<div>
				<sup>{element.mass}</sup>{element.symbol}
			</div>
			<button class="inactivate-button" on:click={toggleElementRetired}
				>{element.retired ? 'Activate' : 'Inactivate'}</button
			>
		</div>
		{#if element.retired}
			<div class="w-12" />
		{:else}
			<button class="btn" on:click={() => (editing = true)}>Edit</button>
		{/if}
	{/if}
	{formMessage ?? ''}
</div>
