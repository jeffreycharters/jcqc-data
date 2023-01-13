<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let element: MethodElement;
	$: divClass = element.active ? 'active-element' : 'inactive-element';

	const dispatch = createEventDispatcher();

	const dispatchElement = () => {
		dispatch('toggleElement', element);
	};
</script>

<div class="{divClass} relative">
	<div class="flex flex-col flex-start">
		<div><sup>{element.mass}</sup>{element.symbol}</div>
		<button class="inactivate-button" on:click={dispatchElement}
			>{element.active ? 'Remove' : 'Add'}</button
		>
	</div>
</div>
