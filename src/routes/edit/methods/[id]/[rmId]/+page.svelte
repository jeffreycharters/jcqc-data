<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { PageData } from './$types';

	export let data: PageData;
	let { limitsArray } = data;

	let formMessage = '';

	const { method, referenceMaterial, methodReferenceMaterialId } = data;

	const saveData = async () => {
		if (!limitsArray) return;
		for (let i = 0; i < limitsArray.length; ++i) {
			const elementData = {
				methodReferenceMaterial: methodReferenceMaterialId,
				elementId: limitsArray[i].element.id,
				upperBound: limitsArray[i].upperBound,
				lowerBound: limitsArray[i].lowerBound
			};
			try {
				await pb
					.collection('referenceMaterialElements')
					.update(limitsArray[i].referenceMaterialElementsId || '', JSON.stringify(elementData));
				formMessage = 'Saved!';
			} catch (_) {
				await pb.collection('referenceMaterialElements').create(JSON.stringify(elementData));
			}
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
		{/each}
		<input type="submit" value="Save Changes" />
		{formMessage}
	{/if}
</form>
