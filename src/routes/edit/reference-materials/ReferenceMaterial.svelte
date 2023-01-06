<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { ReferenceMaterialsResponse } from '$lib/pocketbase-types';
	import { createEventDispatcher } from 'svelte';

	export let rm: ReferenceMaterialsResponse;
	let name = rm.name;
	const dispatch = createEventDispatcher();

	let editing = false;
	let formMessage = '';

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

{#if editing}
	<form>
		<label for="name">Name</label>
		<input type="text" name="name" placeholder="e.g. QM-S Q-2116" bind:value={name} />
		<input type="submit" on:click|preventDefault={updateRM} value="Update" />
		<button on:click={() => (editing = false)}>Cancel</button>
	</form>
{:else}
	<div>
		{rm.name}
		<button on:click={() => (editing = true)}>Edit</button>
		<button on:click={() => dispatch('toggleActive', { method: rm })}>Inactivate</button>
		{#if formMessage}
			// {formMessage} //
		{/if}
	</div>
{/if}
