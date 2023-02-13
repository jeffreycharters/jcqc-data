<script lang="ts">
	import TextInput from '$lib/components/TextInput.svelte';
	import { method } from '$lib/stores';
	import { fade } from 'svelte/transition';
	import BlankList from './BlankList.svelte';

	let newBlankName = '';
	let blankMessage = '';
	let open = false;
	let addFormOpen = false;
	let addFormDiv: HTMLDivElement;
	let contentDiv: HTMLDivElement;

	const createNewBlank = async () => {
		if (!newBlankName) {
			blankMessage = 'Please add a blank name';
			return;
		}
		try {
			await $method?.createNewBlank(newBlankName);
			$method = $method;
		} catch (err) {
			const error = err as Error;
			blankMessage = error.message;
			return;
		}
		newBlankName = '';
		addFormOpen = false;
	};
</script>

<div class="basic-border py-4 px-8 mt-4">
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
			<h2 class="inline-flex gap-4">Blanks and Detection Limits</h2>
		</button>

		{#if blankMessage}
			<div
				class="text-sm text-amber-600 italic tracking-wide w-36 text-center"
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 100 }}
			>
				{blankMessage}
			</div>
		{/if}
	</div>

	<div
		class="overflow-hidden transition-all"
		style="max-height: {open ? `${contentDiv.scrollHeight}px` : '0'}"
		bind:this={contentDiv}
	>
		<div class="flex flex-col gap-4 mt-4">
			{#if $method?.blanks && $method.blanks?.size > 0}
				{#each Array.from($method.blanks).sort() as [_, blank] (blank.id)}
					<BlankList {blank} />
				{/each}
			{/if}

			<div class="basic-border py-2 px-4 w-fit transition-all">
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
					<h3>Add New Blank Type</h3>
				</button>

				<div
					class="overflow-hidden"
					style="max-height: {addFormOpen ? `${addFormDiv.scrollHeight}px` : '0'}"
					bind:this={addFormDiv}
				>
					<form class="w-48">
						<TextInput
							label="Blank Name"
							placeholder="e.g. Method Blank"
							name="blank-name"
							bind:value={newBlankName}
						/>

						<div class="flex flex-col gap-2 items-start">
							<div class="text-sm text-red-500">{blankMessage ?? ''}</div>
							<input
								type="submit"
								value="+Add"
								class="btn font-semibold w-full"
								on:click|preventDefault={createNewBlank}
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
