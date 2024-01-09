<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import { setMethodElements } from "$lib/elements"
	import { pb } from "$lib/pocketbase"
	import type { ElementsResponse, MethodsResponse } from "$lib/pocketbase-types"
	import { methodStore } from "$lib/stores"

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

<div class="basic-border h-full w-full flex justify-center items-center inactive-element bg-white">
	<ElementWithMass symbol={element.symbol} mass={element.mass} />
	<button class="inactivate-button" on:click={addElement}>Add</button>
</div>

<style lang="postcss">
	.inactive-element {
		@apply border border-gray-300 rounded shadow py-2 px-4 flex items-center justify-around text-gray-400;
	}
</style>
