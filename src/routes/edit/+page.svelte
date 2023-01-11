<script lang="ts">
	import NumberInput from '$lib/components/NumberInput.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { pb } from '$lib/pocketbase';
	import type { MethodsResponse } from '$lib/pocketbase-types';
	import { methods } from '$lib/stores';
	import type { PageData } from './$types';
	import MethodCard from './MethodCard.svelte';

	export let data: PageData;

	methods.set(data.methodList);

	let name: string;
	let rpdLimit: number;
	let calibrationCount = 1;

	let formError: string;

	$: activeMethods = $methods.filter((e) => e.active);
	$: inactiveMethods = $methods.filter((e) => !e.active);

	const addMethod = async () => {
		if (!name || !calibrationCount) formError = 'Missing something';
		const methodData = JSON.stringify({
			name,
			calibrationCount,
			rpdLimit,
			active: true
		});
		try {
			const newMethod: MethodsResponse = await pb.collection('methods').create(methodData);
			methods.update((n) => {
				const newList = [...n, newMethod];
				newList.sort((a, b) => (a.name < b.name ? 1 : -1));
				name = '';
				rpdLimit = 0;
				return newList;
			});
		} catch (err) {
			const error = err as Error;
			console.log(error);
		}
	};

	const toggleMethodActive = async (method: MethodsResponse) => {
		const methodData = {
			active: !method.active
		};
		const updatedMethod = await pb.collection('methods').update(method.id, methodData);

		methods.update((n) => {
			const selectedMethod = n.find((e) => e.id === updatedMethod.id);
			if (selectedMethod) {
				selectedMethod.active = updatedMethod.active;
			}
			return n;
		});
	};
</script>

<h1 class="mb-4">Method Select</h1>

<div class="grid grid-cols-4 gap-4">
	{#each activeMethods as method (method.id)}
		<MethodCard {method} on:toggleActive={() => toggleMethodActive(method)} />
	{/each}
	{#each inactiveMethods as method (method.id)}
		<MethodCard {method} on:toggleActive={() => toggleMethodActive(method)} />
	{/each}
</div>
<div class="border border-gray-900 w-fit p-4 rounded shadow my-4">
	<h2>Add new</h2>

	<form on:submit|preventDefault={addMethod}>
		<TextInput name="name" label="Method Name" bind:value={name} />
		<div class="flex gap-8">
			<NumberInput
				name="cal-count"
				label="Number of non-blank calibration standards"
				bind:value={calibrationCount}
			/>
			<NumberInput name="rpd-limit" label="RPD warning limit" bind:value={rpdLimit} />
		</div>

		<div class="w-fit ml-auto mr-0 mt-4">
			<button type="submit" class="btn">Add Method</button>
			{#if formError}
				<div style="color: #cc0000">{formError}</div>
			{/if}
		</div>
	</form>
</div>

<h1>Add, update or remove</h1>

<p><a href="/edit/elements">Elements</a></p>
<p><a href="/edit/reference-materials">Reference Materials</a></p>

<p><a href="/">Back to main</a></p>
