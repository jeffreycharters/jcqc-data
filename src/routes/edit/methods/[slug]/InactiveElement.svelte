<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import { pb } from "$lib/pocketbase"
	import type { ElementsResponse, MethodsResponse } from "$lib/pocketbase-types"
	import { method } from "$lib/stores"
	import { UnitTypes, type ElementsExpanded, type Units } from "$lib/types"

	export let element: ElementsResponse

	const addElement = () => {
		const newUnits = { ...$method?.units, [element.id]: UnitTypes.PPM }
		pb.collection("methods")
			.update($method?.id!, {
				"elements+": element.id,
				units: newUnits,
				expand: "elements,checkStandards"
			})
			.then((updatedMethod) => {
				$method = updatedMethod as MethodsResponse<Units, ElementsExpanded>
			})
			.catch((err) => console.log(err))
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
