<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { ReferenceMaterialsResponse } from '$lib/pocketbase-types';
	import type { PageData } from './$types';

	export let data: PageData;
	let { referenceMaterials } = data || [];

	let name = '';

	async function addRM() {
		const rmData = JSON.stringify({
			name,
			active: true
		});
		const addedRM: ReferenceMaterialsResponse = await pb
			.collection('referenceMaterials')
			.create(rmData);
		referenceMaterials = [...referenceMaterials, addedRM];
		name = '';
	}
</script>

<h1>Reference Materials</h1>

<h2>Add a Reference Material</h2>

<form on:submit|preventDefault={addRM}>
	<div>
		<label for="name">Full name</label>
		<input type="text" name="name" placeholder="e.g. QM-S Q-2116" bind:value={name} />
	</div>
	<input type="submit" value="Add Reference" />
</form>

<h2>Reference Materials</h2>

{#each referenceMaterials as rm (rm.id)}
	<div>
		{rm.name}
	</div>
{/each}
