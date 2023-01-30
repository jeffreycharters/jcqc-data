<script lang="ts">
	import { page } from '$app/stores';
	import { method } from '$lib/stores';
	import { fade } from 'svelte/transition';
	import EditIcon from '$lib/components/EditIcon.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import ReferenceMaterialList from './ReferenceMaterialList.svelte';

	$: referenceMaterials = $method.referenceMaterials;

	let newReferenceMaterialName = '';
	let formMessage: string;

	const createNewReferenceMaterial = async () => {
		console.log('creatin');
	};
</script>

<div class="basic-border py-4 px-8 mt-4">
	<h2>Reference Materials</h2>

	<div class="flex flex-col gap-4">
		{#if referenceMaterials && referenceMaterials?.size > 0}
			{#each Array.from(referenceMaterials).sort() as [_, referenceMaterial] (referenceMaterial.id)}
				<ReferenceMaterialList {referenceMaterial} />
			{/each}
		{/if}

		<div class="basic-border p-4 w-fit">
			<h3>Add New Reference Material</h3>
			<form class="w-48">
				<TextInput
					label="Reference Material Name"
					placeholder="e.g. Bovine Liver"
					name="rm-name"
					bind:value={newReferenceMaterialName}
				/>

				<div class="flex flex-col gap-2 items-start">
					<div class="text-sm text-red-500">{formMessage ?? ''}</div>
					<input
						type="submit"
						value="+Add"
						class="btn font-semibold w-full"
						on:click|preventDefault={createNewReferenceMaterial}
					/>
					// TODO: Make this collapsible
				</div>
			</form>
		</div>
	</div>
</div>
