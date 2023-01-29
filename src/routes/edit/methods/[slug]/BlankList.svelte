<script lang="ts">
	import type { BlanksResponse } from '$lib/pocketbase-types';
	import { method } from '$lib/stores';
	import BlankElement from './BlankElement.svelte';

	export let blank: BlanksResponse;

	$: elementList = $method.elements;
	let statusMessage = '';

	let timer: NodeJS.Timeout;
	const statusUpdate = (message: string, timeout = 3000) => {
		if (timer) clearTimeout(timer);

		statusMessage = message;
		timer = setTimeout(() => (statusMessage = ''), timeout);
	};

	const deleteBlank = async () => {
		await $method.deleteBlank(blank.name);
		$method = $method;
	};
</script>

<div class="basic-border w-full h-full p-4">
	<div class="flex justify-between items-center mb-4">
		<div class="flex items-baseline gap-4">
			<h3 class="">{blank.name}</h3>
			<div class="italic font-bold text-amber-600">{statusMessage ?? ''}</div>
		</div>
		<button on:click={deleteBlank}>
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
				<BlankElement
					{element}
					blankName={blank.name}
					on:updateStatus={(event) => statusUpdate(event.detail)}
				/>
			{/each}
		</div>
	{/if}
</div>
