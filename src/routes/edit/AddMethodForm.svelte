<script lang="ts">
	import NumberInput from '$lib/components/NumberInput.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { pb } from '$lib/pocketbase';
	import type { MethodsResponse } from '$lib/pocketbase-types';
	import { methods } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';
	let formError = '';
	let name: string;
	let rpdLimit: number;
	let calibrationCount = 1;

	const dispatch = createEventDispatcher();

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
</script>

<div class="border border-gray-900 w-fit p-4 rounded shadow my-4 bg-white">
	<div class="flex justify-between items-center">
		<h2>Add new</h2>
		<button on:click={() => dispatch('close')}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="icon icon-tabler icon-tabler-square-x"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<rect x="4" y="4" width="16" height="16" rx="2" />
				<path d="M10 10l4 4m0 -4l-4 4" />
			</svg>
		</button>
	</div>
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
