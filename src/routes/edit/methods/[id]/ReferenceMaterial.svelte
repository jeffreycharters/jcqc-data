<script lang="ts">
	import { page } from '$app/stores';
	import { pb } from '$lib/pocketbase';
	import type { MethodReferenceMaterialsResponse } from '$lib/pocketbase-types';
	import { referenceMaterials, method } from '$lib/stores';
	import { fade } from 'svelte/transition';

	export let mrm: MethodReferenceMaterialsResponse;

	let formMessage: string;

	let divClass = mrm.active ? 'active-element' : 'inactive-element';

	const toggleMaterialActive = async () => {
		const data = JSON.stringify({
			active: !mrm.active
		});
		const thisMaterial = await pb
			.collection('methodReferenceMaterials')
			.getFirstListItem(`referenceMaterial = "${mrm.id}" && method = "${$method.id}"`);
		const updatedMaterial = await pb
			.collection('methodReferenceMaterials')
			.update(thisMaterial.id, data);
		referenceMaterials.update((n) => {
			const selectedMaterial = n.find((m) => m.id === updatedMaterial.id);
			if (selectedMaterial) {
				selectedMaterial.active = updatedMaterial.active;
			}
			return n;
		});
	};
</script>

<div class="{divClass} relative">
	<div class="flex flex-col">
		<div>
			{mrm?.id}
		</div>
		<button class="inactivate-button" on:click={toggleMaterialActive}
			>{mrm.active ? 'Inactivate' : 'Activate'}</button
		>
	</div>
	{#if !mrm.active}
		<div class="w-12" />
	{:else}
		<div>
			<a href="{$page.url.pathname}/{mrm.id}" class="btn no-underline">Edit</a>
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
