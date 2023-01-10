<script lang="ts">
	import { createLoq, updateLoqByMethodAndElement } from '$lib/methods';
	import type { ElementsResponse, LoqsResponse, MethodsResponse } from '$lib/pocketbase-types';

	export let method: MethodsResponse;
	export let usedElements: ElementsResponse[];
	export let loqs: LoqsResponse[];

	let loqMessage = '';

	interface LOQItem {
		value: number | string | undefined;
		existsInDb: boolean;
	}

	interface LOQArray {
		[key: string]: LOQItem;
	}

	let loqArray: LOQArray = {};
	usedElements.forEach((e) => {
		const loq = loqs.find((loq) => loq.element === e.id);
		loqArray[e.id] = {
			value: loq?.value ?? undefined,
			existsInDb: !!loq
		};
	});

	const saveLoqs = async () => {
		usedElements.forEach(async (e) => {
			const loqItem = loqArray[e.id];
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
			<input type="text" bind:value={loqArray[element.id].value} />
		</div>
	{/each}

	<button>Save LOQs</button>
	{loqMessage}
</form>
