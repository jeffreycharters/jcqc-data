<script lang="ts">
	import NumberInput from '$lib/components/NumberInput.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { pb } from '$lib/pocketbase';
	import type { MethodsResponse } from '$lib/pocketbase-types';
	import { methods, showAddForm } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';
	import slugify from 'slugify';

	let formError = '';
	let name: string;
	let rpdLimit: number;
	let calibrationCount = 1;
	let description: string;
	let checkStandardTolerance: number;
	let checkStandardName: string;

	let addFormDiv: HTMLElement;

	$: formHeight = !addFormDiv || !$showAddForm ? '0' : `${addFormDiv.scrollHeight}px`;

	const dispatch = createEventDispatcher();

	const addMethod = async () => {
		if (!name || !calibrationCount) formError = 'Missing something';

		const methodData = JSON.stringify({
			name,
			slug: slugify(name, { lower: true }),
			rpdLimit,
			active: true,
			calibrationCount,
			description,
			checkStandardName,
			checkStandardTolerance
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
			formError = error.message;
		}
	};
</script>

<div
	bind:this={addFormDiv}
	class="overflow-y-hidden transition-all w-fit mx-auto"
	style="max-height: {formHeight}"
>
	<div class="border border-gray-900 w-fit p-4 rounded shadow my-4 bg-white mb-8">
		<div class="flex justify-between items-center">
			<h2>Add new</h2>
			<button on:click={() => dispatch('close')}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
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
			<TextInput name="name" label="Method Name" placeholder="e.g. TOXI-064" bind:value={name} />
			<TextInput
				name="name"
				label="Method Description"
				placeholder="e.g. Metals in sewage"
				bind:value={description}
			/>
			<div class="flex gap-8 max-w-sm items-end">
				<NumberInput
					name="cal-count"
					label="Number of non-blank calibration standards"
					bind:value={calibrationCount}
				/>
				<NumberInput
					name="rpd-limit"
					label="RPD warning limit (%)"
					bind:value={rpdLimit}
					placeholder="e.g. 20"
				/>
			</div>

			<div class="flex gap-8 my-2 items-end">
				<TextInput
					name="check-standard-name"
					label="Check Standard Name"
					bind:value={checkStandardName}
					placeholder="e.g. Calibration Check"
				/>
				<NumberInput
					name="check-standard-limit"
					label="Check Standard Tolerance (%)"
					bind:value={checkStandardTolerance}
					placeholder="e.g. 15"
				/>
			</div>

			<div class="w-fit ml-auto mr-0 mt-4">
				<button type="submit" class="btn">Add Method</button>
				{#if formError}
					<div style="color: #cc0000">{formError}</div>
				{/if}
			</div>
		</form>
	</div>
</div>
