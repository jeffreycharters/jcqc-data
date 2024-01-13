<script lang="ts">
	import { methods, methodStore } from "$lib/stores"
	import { page } from "$app/stores"
</script>

<div class="border border-gray-500 rounded w-[36rem] py-2">
	<h2 class="text-center">Methods</h2>
	<div class="flex flex-wrap justify-center mx-auto gap-3">
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
			class="btn my-2 method-button no-underline"
			on:click={() => ($methodStore = null)}>Clear</a
		>
	</div>
</div>

<style lang="postcss">
	.selected-button {
		@apply text-sky-600 border-sky-700 shadow-sm shadow-sky-700/50 font-semibold;
		box-shadow: "0 0 5px #086077";
	}
	.method-button {
		@apply text-gray-600 border-gray-700 scale-95 transition-all;
	}
</style>
