<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { PageData } from './$types';

	export let data: PageData;
	let { limitsArray, newReferenceMaterial } = data;

	let formMessage = '';

	const { method, referenceMaterial } = data;

	const saveData = async () => {
		for (let i = 0; i < limitsArray.length; ++i) {
			const elementData = {
				methodId: method.id,
				referenceMaterialId: referenceMaterial.id,
				elementId: limitsArray[i].element.id,
				upperBound: limitsArray[i].upperBound,
				lowerBound: limitsArray[i].lowerBound
			};
			try {
				if (newReferenceMaterial)
					await pb.collection('methodReferenceMaterials').create(JSON.stringify(elementData));
				if (!newReferenceMaterial)
					await pb
						.collection('methodReferenceMaterials')
						.update(limitsArray[i].methodReferenceMaterialId || '', JSON.stringify(elementData));
				formMessage = 'Saved!';
			} catch (err) {
				const error = err as Error;
				console.log(error.message);
			}
		}
	};
</script>

<h1>
	{method.name}: {referenceMaterial.name}
</h1>

<form on:submit|preventDefault={saveData}>
	{#each limitsArray as limits, index (limits.element.id)}
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
</form>
