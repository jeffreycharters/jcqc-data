<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { ReferenceMaterialsResponse } from '$lib/pocketbase-types';
	import type { PageData } from './$types';
	import AddReferenceMaterialForm from './AddReferenceMaterialForm.svelte';
	import ReferenceMaterial from './ReferenceMaterial.svelte';

	import { referenceMaterials } from '$lib/stores';

	export let data: PageData;
	$referenceMaterials = data.referenceMaterialList;

	$: activeMaterials = $referenceMaterials.filter((m) => m.active);
	$: inactiveMaterials = $referenceMaterials.filter((m) => !m.active);
</script>

<h1>Reference Materials</h1>

<p class="my-4">
	To edit the expected values for a reference material, do it from the <a href="/edit/methods"
		>edit method page</a
	>.
</p>

<div class="list-grid-container mt-8">
	{#each activeMaterials as rm (rm.id)}
		<ReferenceMaterial {rm} />
	{/each}

	{#each inactiveMaterials as rm (rm.id)}
		<ReferenceMaterial {rm} />
	{/each}
</div>

<div class="mt-8">
	<AddReferenceMaterialForm />
</div>
