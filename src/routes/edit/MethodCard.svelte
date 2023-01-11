<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { MethodsResponse } from '$lib/pocketbase-types';
	import { methods } from '$lib/stores';
	export let method: MethodsResponse;
	const { active } = method;

	const accentColour = active ? 'gray-900' : 'gray-300';

	const toggleMethodActive = async () => {
		const methodData = {
			active: !method.active
		};
		const updatedMethod: MethodsResponse = await pb
			.collection('methods')
			.update(method.id, methodData);

		methods.update((n) => {
			const selectedMethod = n.find((e) => e.id === updatedMethod.id);
			if (selectedMethod) {
				selectedMethod.active = updatedMethod.active;
			}
			return n;
		});
	};
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
			on:click={toggleMethodActive}>{active ? 'Inactivate' : 'Activate'}</button
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
