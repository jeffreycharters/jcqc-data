<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import { setMethodElements } from "$lib/elements"
	import { pb } from "$lib/pocketbase"
	import type { ElementsResponse } from "$lib/pocketbase-types"
	import { methodStore } from "$lib/stores"
	// @ts-expect-error
	import IconSquareRoundedPlus from "@tabler/icons-svelte/dist/svelte/icons/IconSquareRoundedPlus.svelte"

	export let element: ElementsResponse

	async function addElement() {
		await pb.collection("methodElements").create({
			element: element.id,
			method: $methodStore!.id,
			units: "ppm"
		})

		await setMethodElements($methodStore!.id)
	}
</script>

<button
	class="basic-border inactive-element flex h-full w-full items-center justify-center bg-white"
	on:click={addElement}
>
	<div class="flex w-full items-center justify-evenly gap-2">
		<ElementWithMass symbol={element.symbol} mass={element.mass} class="text-xl font-bold" />

		<div class="flex items-center gap-1 font-semibold">
			<IconSquareRoundedPlus class="h-4 w-4" />
			<span>Activate</span>
		</div>
	</div>
</button>

<style lang="postcss">
	.inactive-element {
		@apply flex items-center justify-around rounded border border-gray-300 px-4 py-2 text-gray-400 shadow;
	}
</style>
