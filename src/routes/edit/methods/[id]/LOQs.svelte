<script lang="ts">
	import NumberInput from '$lib/components/NumberInput.svelte';
	import { createLoq, updateLoqByMethodAndElement } from '$lib/methods';
	import type { ElementsResponse, MethodsResponse } from '$lib/pocketbase-types';
	import { loqs } from '$lib/stores';

	export let method: MethodsResponse;
	export let usedElements: ElementsResponse[];

	let loqMessage = '';

	const saveLoqs = async () => {
		usedElements.forEach(async (e) => {
			const loqItem = $loqs[e.id];

			if (loqItem.existsInDb)
				await updateLoqByMethodAndElement(method.id, e.id, Number(loqItem.value));
			else {
				const newLoq = await createLoq(method.id, e.id, Number(loqItem.value));
				if (newLoq) loqItem.existsInDb = true;
			}
			loqMessage = 'Saved!';
		});
	};
</script>

<div class="basic-border py-4 px-8 mt-4">
	<h2 class="my-4">Detection Limits</h2>
	<form on:submit|preventDefault={saveLoqs}>
		<div class="grid grid-cols-2 grid-flow-row gap-x-4">
			{#each usedElements as element (element.id)}
				<div class="max-w-[8rem] bg-gray-100 rounded my-1 p-1">
					<NumberInput
						name="{element.symbol}-{element.mass}-loq"
						bind:value={$loqs[element.id].value}
						label="<sup>{element.mass}</sup>{element.symbol}"
					/>
				</div>
			{/each}
		</div>
		<div class="flex justify-between items-center mt-2">
			<div class="text-sm text-green-600">{loqMessage}</div>
			<button class="btn w-fit h-fit self-center justify-self-center">Save LOQs</button>
		</div>
	</form>
</div>
