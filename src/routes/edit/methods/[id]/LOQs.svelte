<script lang="ts">
	import { createLoq, updateLoqByMethodAndElement } from '$lib/methods';
	import type { ElementsResponse, LoqsResponse, MethodsResponse } from '$lib/pocketbase-types';
	import type { LOQDict } from '$lib/stores';
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

<h2>Detection Limits</h2>
<form on:submit|preventDefault={saveLoqs}>
	{#each usedElements as element (element.id)}
		<div>
			<label for="{element.symbol}-{element.mass}-loq">
				<sup>{element.mass}</sup>{element.symbol}
			</label>
			<input type="text" bind:value={$loqs[element.id].value} />
		</div>
	{/each}

	<button>Save LOQs</button>
	{loqMessage}
</form>
