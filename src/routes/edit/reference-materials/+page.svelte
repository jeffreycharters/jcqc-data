<script lang="ts">
	import { referenceMaterials } from '$lib/stores';
	import AddReferenceMaterialForm from './AddReferenceMaterialForm.svelte';
	import ReferenceMaterial from './ReferenceMaterial.svelte';

	$: activeRms = $referenceMaterials.filter((rm) => rm.active);
	$: inactiveRms = $referenceMaterials.filter((rm) => !rm.active);
</script>

<h1>Reference Materials</h1>

<p class="my-4">
	To edit the expected values for a reference material, do it from the <a href="/edit"
		>edit method page</a
	>.
</p>

<div class="grid grid-cols-5 gap-4">
	{#each activeRms.sort( (a, b) => (a.name < b.name ? -1 : 1) ) as referenceMaterial (referenceMaterial.id)}
		<ReferenceMaterial {referenceMaterial} />
	{/each}
	{#each inactiveRms.sort( (a, b) => (a.name < b.name ? -1 : 1) ) as referenceMaterial (referenceMaterial.id)}
		<ReferenceMaterial {referenceMaterial} />
	{/each}
</div>

<div class="mt-8">
	<AddReferenceMaterialForm />
</div>
