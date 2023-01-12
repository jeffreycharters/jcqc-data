<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<button
	on:click={() => dispatch('toggleAddForm')}
	class="border border-gray-500 w-full p-4 rounded shadow-lg flex gap-2 items-center justify-center font-bold"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="icon icon-tabler icon-tabler-text-plus"
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
		<path d="M19 10h-14" />
		<path d="M5 6h14" />
		<path d="M14 14h-9" />
		<path d="M5 18h6" />
		<path d="M18 15v6" />
		<path d="M15 18h6" />
	</svg>
	Add Method
</button>
