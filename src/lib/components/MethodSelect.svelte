<script lang="ts">
	import { getMethodContext, getMethodsContext } from "$lib/storage"

	const method = getMethodContext()
	const methods = getMethodsContext()
</script>

<div class="flex-grow rounded border border-gray-500 px-4 py-2">
	<h2 class="text-center">Methods</h2>
	<div class="mx-auto my-2 flex flex-wrap justify-center gap-x-2 gap-y-1">
		{#each $methods ?? [] as method_i (method_i.slug)}
			<button
				on:click={() => {
					$method = method_i
					localStorage.setItem("method", method_i.slug)
				}}
				class="btn no-underline {method_i.slug === $method?.slug
					? 'selected-button'
					: 'method-button'}">{method_i.name}</button
			>
		{:else}
			<div class="flex flex-col items-center">
				<div>No methods found.</div>
				<a class="text-green-600 font-semibold underline" href="/edit">Go add some.</a>
			</div>
		{/each}

		{#if $methods?.length}
			<button class="btn method-button no-underline" on:click={() => ($method = undefined)}
				>Clear</button
			>
		{/if}
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
