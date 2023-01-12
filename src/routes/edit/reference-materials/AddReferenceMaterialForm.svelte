<script lang="ts">
	import TextInput from '$lib/components/TextInput.svelte';
	import type { ReferenceMaterialsResponse } from '$lib/pocketbase-types';
	import { referenceMaterials } from '$lib//stores';
	import { pb } from '$lib/pocketbase';

	let name: string;
	let formError = '';

	async function addRM() {
		const rmData = JSON.stringify({
			name,
			active: true
		});
		const addedRM: ReferenceMaterialsResponse = await pb
			.collection('referenceMaterials')
			.create(rmData);
		$referenceMaterials = [...$referenceMaterials, addedRM];
		name = '';
	}
</script>

<div class="border border-gray-800 rounded shadow w-fit p-4">
	<h2 class="-mt-2">Add Material</h2>

	<form on:submit|preventDefault={addRM}>
		<TextInput
			name="name"
			label="Material Name"
			bind:value={name}
			placeholder="e.g. Bovine Liver"
		/>
		<button type="submit" class="btn h-fit mb-2">Add Material</button>
		{#if formError}
			<div class="text-red-600 text-sm italic ml-2">{formError}</div>
		{/if}
	</form>
</div>
