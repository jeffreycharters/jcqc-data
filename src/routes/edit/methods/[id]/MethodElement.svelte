<script lang="ts">
	import type { ElementsResponse } from '$lib/pocketbase-types';
	import { loqs } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';

	export let element: ElementsResponse;
	$: activeInMethod = !!$loqs[element.id];
	$: divClass = activeInMethod ? 'active-element' : 'inactive-element';

	const dispatch = createEventDispatcher();

	const dispatchElement = () => {
		dispatch('toggleElement', element);
	};
</script>

<div class="{divClass} relative">
	<div class="flex flex-col flex-start">
		<div><sup>{element.mass}</sup>{element.symbol}</div>
		<button class="inactivate-button" on:click={dispatchElement}
			>{activeInMethod ? 'Remove' : 'Add'}</button
		>
	</div>
</div>
