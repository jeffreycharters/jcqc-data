<script lang="ts">
	import EditIcon from '$lib/components/EditIcon.svelte';
	import type { ReferenceMaterialsResponse } from '$lib/pocketbase-types';
	import { method } from '$lib/stores';
	import ReferenceMaterialElement from './ReferenceMaterialElement.svelte';

	export let referenceMaterial: ReferenceMaterialsResponse;
	let { name } = referenceMaterial;

	// TODO: Make this about RMs and not check standards

	$: elementList = $method?.elements;
	let statusMessage = '';
	let editing = false;

	let timer: NodeJS.Timeout;
	const statusUpdate = (message: string, timeout = 3000) => {
		if (timer) clearTimeout(timer);

		statusMessage = message;
		timer = setTimeout(() => (statusMessage = ''), timeout);
	};

	const deleteCheckStandard = async () => {
		await $method?.deleteReferenceMaterial(referenceMaterial.name);
		$method = $method;
	};

	const updateName = async () => {
		console.log('updating name!');
		await $method?.updateReferenceMaterialName(referenceMaterial.id, name);
		editing = false;
	};
</script>

<div class="basic-border w-full h-full p-4">
	<div class="flex justify-between items-center mb-4">
		<div class="flex items-baseline gap-2">
			<form
				class="flex items-center {editing ? 'gap-1' : 'gap-2'}"
				on:submit|preventDefault={updateName}
			>
				{#if editing}
					<label for="check-name">Name:</label>
					<input class="basic-border px-2" type="text" bind:value={name} />
					<input type="submit" value="Update" class="btn" />
				{:else}
					<h3>{name}</h3>
				{/if}
				<button type="button" on:click={() => (editing = !editing)} class={editing ? 'btn' : ''}>
					{#if editing}
						Cancel
					{:else}
						<EditIcon classes="stroke-gray-400 h-5 w-5" strokeWidth="1.75" />
					{/if}
				</button>
			</form>
			<div class="italic font-bold text-amber-600">{statusMessage ?? ''}</div>
		</div>
		<button on:click={deleteCheckStandard}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-8 w-8 stroke-red-700 hover:bg-red-100 py-[6px] rounded-full transition-colors"
				viewBox="0 0 24 24"
				stroke-width="2"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M4 7l16 0" />
				<path d="M10 11l0 6" />
				<path d="M14 11l0 6" />
				<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
				<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
			</svg>
		</button>
	</div>

	{#if elementList && elementList.length > 0}
		<div class="grid grid-cols-6 gap-4 text-center">
			{#each elementList.sort((a, b) => (a.mass < b.mass ? -1 : 1)) as element (element.id)}
				<ReferenceMaterialElement
					{element}
					referenceMaterialName={referenceMaterial.name}
					on:updateStatus={(event) => statusUpdate(event.detail)}
				/>
			{/each}
		</div>
	{/if}
</div>
