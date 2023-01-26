<script lang="ts">
	import { goto } from '$app/navigation';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import { pb } from '$lib/pocketbase';
	import { createMethodReferenceMaterial } from '$lib/referenceMaterials';
	import { fade } from 'svelte/transition';
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
				element: limitsArray[i].element.id,
				upperBound: limitsArray[i].upperBound ?? undefined,
				lowerBound: limitsArray[i].lowerBound ?? undefined
			};
			if (limitsArray[i].referenceMaterialElementsId) {
				console.log(JSON.stringify(elementData));
				await pb
					.collection('referenceMaterialElements')
					.update(limitsArray[i].referenceMaterialElementsId || '', JSON.stringify(elementData));
			} else {
				const newReferenceElement = await pb
					.collection('referenceMaterialElements')
					.create(JSON.stringify(elementData));
				limitsArray[i].referenceMaterialElementsId = newReferenceElement.id;
			}
		}
		goto(`/edit/methods/${method.id}`, { invalidateAll: true });
	};
</script>

<div
	class="w-full min-h-screen flex justify-center items-center {limitsArray &&
	limitsArray.length < 10
		? '-mt-24'
		: ''}"
	transition:fade|local={{ duration: 200 }}
>
	<div>
		<h1 class="my-4">
			{method?.name}: {referenceMaterial?.name}
		</h1>

		<form on:submit|preventDefault={saveData}>
			{#if limitsArray}
				<div class="basic-border w-fit mb-8">
					<table class="table-auto">
						<thead>
							<tr>
								<th>Element</th>
								<th>Low Cutoff</th>
								<th>High Cutoff</th>
							</tr>
						</thead>

						<tbody>
							{#each limitsArray as limits, index (limits?.element?.id)}
								<tr class={index % 2 === 0 ? 'bg-gray-200' : ''}>
									<th class="pl-8 px-4">
										<div class="flex gap-2 items-baseline">
											<div>
												<sup>{limits.element.mass}</sup>{limits.element?.symbol}
											</div>
											<div class="text-gray-500 text-sm">
												{limits.units}
											</div>
										</div>
									</th>

									<td class="py-2 px-4">
										<NumberInput
											name="{limits.element.id}-lower"
											bind:value={limitsArray[index].lowerBound}
											placeholder="{limits.element.name} low"
										/>
									</td>

									<td class="py-2 pl-4 pr-8">
										<NumberInput
											name="{limits.element.id}-upper"
											bind:value={limitsArray[index].upperBound}
											placeholder="{limits.element.name} high"
										/>
									</td>
								</tr>
							{:else}
								<div>Add some elements to the method, please.</div>
							{/each}
						</tbody>
					</table>
					{#if limitsArray.length > 0}
						<div class="mx-8 my-2 flex justify-between">
							<div class="text-sm text-green-600">
								{formMessage}
							</div>
							<input class="btn" type="submit" value="Save Changes" />
						</div>
					{/if}
				</div>
			{/if}
		</form>
	</div>
</div>
