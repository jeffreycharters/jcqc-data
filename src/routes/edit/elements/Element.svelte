<script lang="ts">
	import NumberInput from '$lib/components/NumberInput.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { pb } from '$lib/pocketbase';
	import type { ElementsResponse } from '$lib/pocketbase-types';
	import { elements } from '$lib/stores';
	import { fade } from 'svelte/transition';

	export let element: ElementsResponse;
	let { name, symbol, mass } = element;

	let formMessage: string;

	const addFormMessage = (message: string, timeout: number = 2000) => {
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
		if (!name || !symbol || !mass) {
			addFormMessage('Input missing data');
			return;
		}
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

<div class="{divClass} {editing ? 'row-span-2' : ''} relative">
	{#if editing}
		<form on:submit|preventDefault={saveChanges}>
			<TextInput name="name" label="Element Name" bind:value={name} />
			<TextInput name="symbol" label="Chemical Symbol" bind:value={symbol} />
			<NumberInput name="mass" label="Isotope Mass" bind:value={mass} />

			<div class="flex justify-between items-center mt-4">
				<button class="btn text-sm" type="submit">Save Changes</button>
				<button type="button" class="text-sm ml-2" on:click={() => (editing = false)}>Cancel</button
				>
			</div>

			<div class="ml-1 text-sm text-red-600">
				{formMessage ?? ''}
			</div>
		</form>
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
			<div>
				<button class="btn" on:click={() => (editing = true)}>Edit</button>
				{#if formMessage}
					<div
						transition:fade|local={{ duration: 100 }}
						class="text-sm text-green-700 absolute -bottom-2 right-2 bg-white rounded border-gray-600 px-2 border"
					>
						{formMessage}
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style lang="postcss">
	.active-element {
		@apply border border-gray-800 rounded shadow py-2 px-4 flex items-center justify-around;
	}
	.inactive-element {
		@apply border border-gray-300 rounded shadow py-2 px-4 flex items-center justify-around text-gray-400;
	}
</style>
