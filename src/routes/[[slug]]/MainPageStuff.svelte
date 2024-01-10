<script lang="ts">
	import { page } from "$app/stores"
	import { methodStore, methods } from "$lib/stores"
	import SelectInstrument from "./SelectInstrument.svelte"
</script>

<div class="absolute bottom-4 left-4">
	<a class="no-underline btn" href="/edit">Edit stuff</a>
</div>

<div class="p-4">
	<div class="align-center">
		<h1 class="text-2xl w-fit mx-auto">JCQC Reporting Application</h1>
		<hr class="w-[36rem] my-4 mx-auto" />
		<div
			class="flex w-[800px] mx-auto justify-between place-items-stretch
        "
		>
			<SelectInstrument />

			<div class="border border-gray-500 rounded w-[36rem] py-2">
				<h2 class="mb-2 text-center">Select Method</h2>
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
		</div>
	</div>
</div>

<slot />

<div class="absolute bottom-4 left-4">
	<a class="no-underline btn" href="/edit">Edit stuff</a>
</div>

<style lang="postcss">
	.selected-button {
		@apply text-teal-600 border-teal-700 shadow-sm shadow-teal-700/50 font-semibold;
		box-shadow: "0 0 5px #086077";
	}
	.method-button {
		@apply text-gray-600 border-gray-700 scale-95 transition-all;
	}
</style>
