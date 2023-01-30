<script lang="ts">
	import NumberInput from '$lib/components/NumberInput.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { pb } from '$lib/pocketbase';
	import type { ElementsResponse, ReferenceMaterialsResponse } from '$lib/pocketbase-types';
	import { referenceMaterials } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	export let referenceMaterial: ReferenceMaterialsResponse;
	let { name } = referenceMaterial;

	let formMessage: string;

	const dispatch = createEventDispatcher();

	const addFormMessage = (message: string, timeout: number = 2000) => {
		formMessage = message;
		setTimeout(() => (formMessage = ''), timeout);
	};

	let editing = false;

	$: divClass = referenceMaterial.active ? 'active-element' : 'inactive-element';

	async function saveChanges() {
		if (!referenceMaterial.name) {
			addFormMessage('Input missing data');
			return;
		}
		const data = JSON.stringify({ name });
		const updatedReferenceMaterial: ReferenceMaterialsResponse = await pb
			.collection('referenceMaterials')
			.update(referenceMaterial.id, data);
		if (!updatedReferenceMaterial) addFormMessage('Error saving!');
		else addFormMessage('Saved!');
		editing = false;
		const filteredReferenceMaterials = $referenceMaterials.filter(
			(rm) => rm.id != updatedReferenceMaterial.id
		);
		$referenceMaterials = [...filteredReferenceMaterials, updatedReferenceMaterial];
	}

	const toggleMaterialActive = async () => {
		const data = JSON.stringify({
			active: !referenceMaterial.active
		});
		const updatedReferenceMaterial = await pb
			.collection('referenceMaterials')
			.update(referenceMaterial.id, data);
		referenceMaterial.active = updatedReferenceMaterial.active;
		$referenceMaterials = $referenceMaterials;
	};
</script>

<div class="{divClass} {editing ? 'row-span-2' : ''} relative">
	{#if editing}
		<form on:submit|preventDefault={saveChanges}>
			<TextInput name="name" label="Material Name" bind:value={name} />

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
		<div class="flex flex-col gap-1">
			<div>
				{referenceMaterial.name}
			</div>
			<button class="inactivate-button" on:click={toggleMaterialActive}
				>{referenceMaterial.active ? 'Inactivate' : 'Activate'}</button
			>
		</div>

		{#if !referenceMaterial.active}
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
