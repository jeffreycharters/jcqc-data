<script lang="ts">
	import { goto } from '$app/navigation';
	import TextInput from '$lib/components/TextInput.svelte';
	import { method } from '$lib/stores';
	import { fade } from 'svelte/transition';
	import CheckStandardList from './CheckStandardList.svelte';

	let newCalName = '';
	let calMessage = '';
	let open = false;
	let addFormOpen = false;
	let addFormDiv: HTMLDivElement;
	let contentDiv: HTMLElement;

	if (!$method) goto('/', { invalidateAll: true });

	const createNewCheckStandard = async () => {
		if (!newCalName) {
			calMessage = 'Please add a blank name';
			return;
		}
		try {
			await $method?.createNewCheckStandard(newCalName);
			$method = $method;
		} catch (err) {
			const error = err as Error;
			calMessage = error.message;
			return;
		}
		newCalName = '';
		addFormOpen = false;
	};
</script>

<div class="basic-border py-4 px-8 mt-4 bg-stone-100">
	<div class="flex items-end gap-4">
		<button class="flex gap-2 items-center" on:click={() => (open = !open)}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 stroke-gray-400 transition-all {open ? 'rotate-90' : ''}"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M7 7l5 5l-5 5" />
				<path d="M13 7l5 5l-5 5" />
			</svg>
			<h2 class="inline-flex gap-4">Check Standard Targets</h2>
		</button>
		{#if calMessage}
			<div
				class="text-sm text-amber-600 italic tracking-wide w-36 text-center"
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 100 }}
			>
				{calMessage}
			</div>
		{/if}
	</div>

	<div
		class="overflow-hidden transition-all"
		style="max-height: {open ? `${contentDiv.scrollHeight}px` : '0'}"
		bind:this={contentDiv}
	>
		<div class="flex flex-col gap-4 mt-4">
			{#if $method?.checkStandards && $method.checkStandards?.size > 0}
				{#each Array.from($method.checkStandards).sort() as [_, checkStandard] (checkStandard.id)}
					<CheckStandardList {checkStandard} />
				{/each}
			{/if}

			<div class="basic-border py-2 px-4 w-fit transition-all bg-white">
				<button
					class="flex items-center gap-2"
					on:click={() => (addFormOpen = !addFormOpen)}
					on:click={() => (contentDiv.style.maxHeight = `${contentDiv.scrollHeight}px`)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 stroke-gray-400 transition-all {addFormOpen ? 'rotate-90' : ''}"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M7 7l5 5l-5 5" />
						<path d="M13 7l5 5l-5 5" />
					</svg>
					<h3>Add New Check Standard</h3>
				</button>

				<div
					class="overflow-hidden"
					style="max-height: {addFormOpen ? `${addFormDiv.scrollHeight}px` : '0'}"
					bind:this={addFormDiv}
				>
					<form class="w-48">
						<TextInput
							label="Check Standard Name"
							placeholder="e.g. Calibration Check"
							name="cal-name"
							bind:value={newCalName}
						/>

						<div class="flex flex-col gap-2 items-start">
							<div class="text-sm text-red-500">{calMessage ?? ''}</div>
							<input
								type="submit"
								value="+Add"
								class="btn font-semibold w-full"
								on:click|preventDefault={createNewCheckStandard}
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
