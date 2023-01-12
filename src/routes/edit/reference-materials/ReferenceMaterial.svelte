<script lang="ts">
	import TextInput from '$lib/components/TextInput.svelte';
	import { pb } from '$lib/pocketbase';
	import type { ReferenceMaterialsResponse } from '$lib/pocketbase-types';
	import { referenceMaterials } from '$lib/stores';
	import { fade } from 'svelte/transition';

	export let rm: ReferenceMaterialsResponse;
	let { name } = rm;

	let editing = false;
	let formMessage = '';

	const divClass = rm.active ? 'active-element' : 'inactive-element';

	async function toggleActive() {
		const activeData = JSON.stringify({
			active: !rm.active
		});
		const updatedMaterial = await pb.collection('referenceMaterials').update(rm.id, activeData);
		const materialInArray = $referenceMaterials.find((m) => m.id === rm.id);
		if (!materialInArray) return;
		materialInArray.active = updatedMaterial.active;
		$referenceMaterials = $referenceMaterials;
	}

	async function updateRM() {
		const rmData = JSON.stringify({
			name
		});
		const updatedRM: ReferenceMaterialsResponse = await pb
			.collection('referenceMaterials')
			.update(rm.id, rmData);
		if (updatedRM) rm = updatedRM;
		editing = false;
		formMessage = 'Saved!';
	}
</script>

<div class="{divClass} {editing ? 'row-span-2' : ''} relative">
	{#if editing}
		<form on:submit|preventDefault={updateRM}>
			<TextInput name="name" label="Material Name" bind:value={name} />

			<div class="flex justify-between items-center">
				<button class="btn text-sm" type="submit">Save Changes</button>
				<button type="button" class="text-sm ml-2" on:click={() => (editing = false)}>Cancel</button
				>
			</div>
		</form>
	{:else}
		<div class="flex flex-col">
			<div>
				{rm.name}
			</div>
			<button class="inactivate-button" on:click={toggleActive}
				>{rm.active ? 'Inactivate' : 'Activate'}</button
			>
		</div>
		{#if !rm.active}
			<div class="w-12" />
		{:else}
			<div>
				<button class="btn" on:click={() => (editing = true)}>Edit</button>
				{#if formMessage}
					<div
						transition:fade|local={{ duration: 100 }}
						class="text-sm text-green-700 absolute -bottom-2 right-2 bg-white rounded border-gray-600 py-1 px-2 border"
					>
						{formMessage}
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>
