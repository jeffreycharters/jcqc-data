<script lang="ts">
	import NumberInput from '$lib/components/NumberInput.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { ElementsResponse } from '$lib/pocketbase-types';
	import { elements } from '$lib//stores';
	import { pb } from '$lib/pocketbase';

	let name: string;
	let symbol: string;
	let mass: number;
	let formError = '';

	const addElement = async () => {
		if (!name || !symbol || !mass) formError = 'Please complete all fields.';
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
			mass = 0;
		} catch (err) {
			const error = err as Error;
			console.log(error);
		}
	};
</script>

<div class="border border-gray-800 rounded shadow w-fit p-4">
	<h2 class="-mt-2">Add Element</h2>

	<form on:submit|preventDefault={addElement}>
		<TextInput name="name" label="Element Name" bind:value={name} placeholder="e.g. Iron" />
		<TextInput name="symbol" label="Chemical Symbol" bind:value={symbol} placeholder="e.g. Fe" />
		<div class="flex items-end justify-between max-w-xs gap-4">
			<NumberInput name="mass" label="Isotope Mass" bind:value={mass} placeholder="e.g. 57" />
			<button type="submit" class="btn h-fit mb-2">Add Element</button>
		</div>
		{#if formError}
			<div class="text-red-600 text-sm italic ml-2">{formError}</div>
		{/if}
	</form>
</div>
