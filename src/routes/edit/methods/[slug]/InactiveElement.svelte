<script lang="ts">
	import ElementWithMass from '$lib/components/ElementWithMass.svelte';
	import type { ElementsResponse } from '$lib/pocketbase-types';
	import { createEventDispatcher } from 'svelte';

	export let element: ElementsResponse;

	const dispatch = createEventDispatcher();

	const addElement = () => {
		dispatch('addElement', element.id);
	};
</script>

<div class="basic-border h-full w-full flex justify-center items-center inactive-element">
	<ElementWithMass symbol={element.symbol} mass={element.mass} />
	<button class="inactivate-button" on:click={addElement}>Add</button>
</div>

<style lang="postcss">
	.inactive-element {
		@apply border border-gray-300 rounded shadow py-2 px-4 flex items-center justify-around text-gray-400;
	}
</style>
