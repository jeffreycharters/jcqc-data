<script lang="ts">
	import TextInput from '$lib/components/TextInput.svelte';
	import { pb } from '$lib/pocketbase';
	import type { ReferenceMaterialsResponse } from '$lib/pocketbase-types';
	import { referenceMaterials } from '$lib/stores';

	let name = '';
	let formError = '';

	async function addRM() {
		console.log('adding reference material', name);
		const data = JSON.stringify({
			name,
			active: true
		});
		const newReferenceMaterial: ReferenceMaterialsResponse = await pb
			.collection('referenceMaterials')
			.create(data);
		if (!newReferenceMaterial) formError = 'Error saving!';
		$referenceMaterials = [...$referenceMaterials, newReferenceMaterial].sort((a, b) =>
			a.name < b.name ? -1 : 1
		);
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
		{#if formError}
			<div class="text-red-500 text-sm ml-2 mb-2">{formError}</div>
		{/if}
		<button type="submit" class="btn h-fit mb-2">+ Add Material</button>
	</form>
</div>
