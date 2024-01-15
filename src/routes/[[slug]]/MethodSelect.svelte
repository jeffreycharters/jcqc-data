<script lang="ts">
	import { methods, methodStore } from "$lib/stores"
	import { page } from "$app/stores"
</script>

<div class="w-[36rem] rounded border border-gray-500 py-2">
	<h2 class="text-center">Methods</h2>
	<div class="mx-auto flex flex-wrap justify-center gap-3">
		{#each $methods ?? [] as method (method.id)}
			<a
				data-sveltekit-preload-data="tap"
				href="/{method.slug}"
				class="btn my-2 no-underline {$page.params.slug === method.slug
					? 'selected-button'
					: 'method-button'}">{method.name}</a
			>
		{/each}
		<a
			href="/"
			data-sveltekit-preload-data="tap"
			class="btn method-button my-2 no-underline"
			on:click={() => ($methodStore = null)}>Clear</a
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
