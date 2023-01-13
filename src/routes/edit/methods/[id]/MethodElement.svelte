<script lang="ts">
	import { loqs, method } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';

	export let element: MethodElement;
	$: divClass = element.active ? 'active-element' : 'inactive-element';

	const dispatch = createEventDispatcher();

	const dispatchElement = () => {
		const loqIndex = $loqs.findIndex(
			(loq) => loq.elementId === element.elementId && loq.methodId === $method.id
		);

		dispatch('toggleElement', { element, loqIndex });
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
