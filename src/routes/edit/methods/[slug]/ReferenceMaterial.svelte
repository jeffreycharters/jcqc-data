<script lang="ts">
	import { page } from '$app/stores';
	import {
		getMethodReferenceMaterialByMethodAndMaterial,
		inactivateMethodReferenceMaterialById
	} from '$lib/referenceMaterials';
	import { method, methodReferenceMaterials } from '$lib/stores';
	import { fade } from 'svelte/transition';

	export let rm: BasicReferenceMaterial;

	let formMessage: string;

	const inactiveReferenceMaterial = async () => {
		const thisMaterial = await getMethodReferenceMaterialByMethodAndMaterial($method.id, rm.id);
		if (!thisMaterial?.id) return;
		const inactivatedMaterial = await inactivateMethodReferenceMaterialById(thisMaterial.id);
		if (!!inactivatedMaterial) {
			const materialIndex = $methodReferenceMaterials.findIndex(
				(rm) => rm.id === inactivatedMaterial.referenceMaterial
			);
			if (materialIndex && $methodReferenceMaterials[materialIndex].active != undefined)
				$methodReferenceMaterials[materialIndex].active =
					!$methodReferenceMaterials[materialIndex].active;
		}
	};
</script>

<div class="basic-border relative {rm.active ? 'active-element' : 'inactive-element'}">
	<div class="flex gap-4 my-1">
		<div>
			{rm?.name}
		</div>
		{#if rm.active}
			<button class="inactivate-button" on:click={inactiveReferenceMaterial}
				>{rm.active ? 'Inactivate' : 'Activate'}</button
			>
		{:else}
			<a href="/edit/methods/{$method.id}/{rm.id}" class="inactivate-button no-underline"
				>Activate</a
			>
		{/if}
	</div>
	{#if !rm.active}
		<div class="w-12" />
	{:else}
		<div>
			<a href="{$page.url.pathname}/{rm.id}" class="btn no-underline">Edit Limits</a>
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
</div>

<style lang="postcss">
	.active-element {
		@apply border border-black rounded shadow py-2 px-4 flex items-center justify-around;
	}
	.inactive-element {
		@apply border border-gray-300 rounded shadow py-2 px-4 flex items-center justify-start text-gray-400;
	}
</style>
