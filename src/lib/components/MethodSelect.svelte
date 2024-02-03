<script lang="ts">
	import { getMethodContext, getMethodsContext, setMethodContext } from "$lib/storage"

	const method = getMethodContext()
	const methods = getMethodsContext()
</script>

<div class="flex-grow rounded border border-gray-500 px-4 py-2">
	<h2 class="text-center">Methods</h2>
	<div class="mx-auto my-2 flex flex-wrap justify-center gap-x-2 gap-y-1">
		{#each $methods ?? [] as method_i (method_i.slug)}
			<button
				on:click={() => ($method = method_i)}
				class="btn no-underline {method_i.slug === $method?.slug
					? 'selected-button'
					: 'method-button'}">{method_i.name}</button
			>
		{/each}
		<button class="btn method-button no-underline" on:click={() => setMethodContext(null)}
			>Clear</button
		>
	</div>
</div>

<style lang="postcss">
	.selected-button {
		@apply border-sky-700 font-semibold text-sky-600 shadow-sm shadow-sky-700/50;
		box-shadow: "0 0 5px #086077";
	}
	.method-button {
		@apply scale-95 border-gray-700 text-gray-600 transition-all;
	}
</style>
