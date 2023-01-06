<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { ReferenceMaterialsResponse } from '$lib/pocketbase-types';
	import type { PageData } from './$types';
	import ReferenceMaterial from './ReferenceMaterial.svelte';

	export let data: PageData;
	let { referenceMaterials } = data || [];

	let name = '';

	$: activeMaterials = referenceMaterials.filter((m) => m.active);
	$: inactiveMaterials = referenceMaterials.filter((m) => !m.active);

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

	async function toggleActive(material: ReferenceMaterialsResponse) {
		const activeData = JSON.stringify({
			active: !material.active
		});
		const updatedMaterial = await pb
			.collection('referenceMaterials')
			.update(material.id, activeData);
		const materialInArray = referenceMaterials.find((m) => m.id === material.id);
		if (!materialInArray) return;
		materialInArray.active = updatedMaterial.active;
		referenceMaterials = referenceMaterials;
	}
</script>

<h1>Reference Materials</h1>

<h2>Add a Reference Material</h2>

<form on:submit|preventDefault={addRM}>
	<div>
		<label for="name">Name</label>
		<input type="text" name="name" placeholder="e.g. QM-S Q-2116" bind:value={name} />
	</div>
	<input type="submit" value="Add Reference" />
</form>

<h2>Reference Materials</h2>

{#each activeMaterials as rm (rm.id)}
	<ReferenceMaterial {rm} on:toggleActive={(event) => toggleActive(event.detail.method)} />
{/each}

<h3>Retired Reference Materials</h3>

{#each inactiveMaterials as rm (rm.id)}
	<div>
		{rm.name} <button on:click={() => toggleActive(rm)}>Activate</button>
	</div>
{/each}
