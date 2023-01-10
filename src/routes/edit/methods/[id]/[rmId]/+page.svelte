<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { createMethodReferenceMaterial } from '$lib/referenceMaterials';
	import type { PageData } from './$types';

	export let data: PageData;
	let { limitsArray, methodReferenceMaterialId } = data;

	let formMessage = '';

	const { method, referenceMaterial } = data;

	const saveData = async () => {
		if (!limitsArray || !method || !referenceMaterial) return;
		if (!methodReferenceMaterialId) {
			const newMaterial = await createMethodReferenceMaterial(method.id, referenceMaterial.id);
			methodReferenceMaterialId = newMaterial.id;
		}
		for (let i = 0; i < limitsArray.length; ++i) {
			const elementData = {
				methodReferenceMaterial: methodReferenceMaterialId,
				elementId: limitsArray[i].element.id,
				upperBound: limitsArray[i].upperBound,
				lowerBound: limitsArray[i].lowerBound
			};
			if (limitsArray[i].referenceMaterialElementsId) {
				await pb
					.collection('referenceMaterialElements')
					.update(limitsArray[i].referenceMaterialElementsId || '', JSON.stringify(elementData));
			} else {
				const newReferenceElement = await pb
					.collection('referenceMaterialElements')
					.create(JSON.stringify(elementData));
				limitsArray[i].referenceMaterialElementsId = newReferenceElement.id;
			}
			formMessage = 'Saved!';
		}
	};
</script>

<h1>
	{method?.name}: {referenceMaterial?.name}
</h1>

<form on:submit|preventDefault={saveData}>
	{#if limitsArray}
		{#each limitsArray as limits, index (limits?.element?.id)}
			<div>
				<strong><sup>{limits.element.mass}</sup>{limits.element?.symbol}</strong>
				<label for="{limits.element.id}-lower}">Low Cutoff</label>
				<input
					type="text"
					name="{limits.element.id}-lower"
					bind:value={limitsArray[index].lowerBound}
				/>
				<label for="{limits.element.id}-upper}">High Cutoff</label>
				<input
					type="text"
					name="{limits.element.id}-upper"
					bind:value={limitsArray[index].upperBound}
				/>
			</div>
		{:else}
			<div>Add some elements to the method, please.</div>
		{/each}
		{#if limitsArray.length > 0}
			<input type="submit" value="Save Changes" />
		{/if}
		{formMessage}
	{/if}
</form>
