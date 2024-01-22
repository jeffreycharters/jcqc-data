<script lang="ts">
	import { methodStore, methods } from "$lib/stores"
	import Output from "./Output.svelte"
</script>

{#if !$methodStore}
	<div class="mb-6 mt-8 w-full max-w-screen-xl">
		<h1 class="mb-4">Test Files</h1>

		<div class="grid grid-cols-5 gap-2">
			{#each $methods ?? [] as method (method.id)}
				<a class="rounded border border-stone-800 p-1" href="/edit/testfiles/{method.slug}"
					>{method.name}</a
				>
			{/each}
		</div>
	</div>
{:else}
	<Output />
{/if}
