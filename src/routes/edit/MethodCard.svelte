<script lang="ts">
	import type { MethodsResponse } from '$lib/pocketbase-types';
	import { createEventDispatcher } from 'svelte';
	export let method: MethodsResponse;
	const { active } = method;

	const accentColour = active ? 'gray-900' : 'gray-300';

	const dispatch = createEventDispatcher();
</script>

<div
	class="border border-{accentColour} w-full p-4 rounded shadow-lg flex items-center justify-around"
>
	<div class="text-{accentColour}">
		<h3>
			{method.name}
		</h3>
		<button
			class="text-sm border border-gray-400 text-gray-400 px-1 rounded-sm border-dotted"
			on:click|stopPropagation={() => dispatch('toggleActive')}
			>{active ? 'Inactivate' : 'Activate'}</button
		>
	</div>
	<div>
		{#if active}
			<a
				href="/edit/methods/{method.id}"
				class="no-underline border-gray-400 border py-1 px-4 rounded hover:bg-gray-200 bg-gray-50"
				>Edit</a
			>
		{:else}
			<div />
		{/if}
	</div>
</div>
