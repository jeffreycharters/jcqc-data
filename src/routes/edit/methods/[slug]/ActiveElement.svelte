<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import { method } from "$lib/stores"
	import { pb } from "$lib/pocketbase"
	import type { ElementsResponse, MethodsResponse } from "$lib/pocketbase-types"
	import { UnitTypes, type ElementsExpanded, type Units } from "$lib/types"
	import { expandedCollections } from "$lib/methods"
	export let element: ElementsResponse

	$: units = $method?.units?.[element.id]

	async function removeElement() {
		const currentUnits = $method?.units
		delete currentUnits?.[element.id]
		pb.collection("methods")
			.update($method?.id!, {
				"elements-": element.id,
				units: currentUnits
			})
			.then((updatedMethod) => {
				$method = updatedMethod as MethodsResponse<Units, ElementsExpanded>
			})
	}

	const setUnits = async (newUnits: UnitTypes) => {
		pb.collection("methods")
			.update($method?.id!, {
				units: { ...$method?.units, [element.id]: newUnits },
				expand: expandedCollections
			})
			.then((updatedMethod) => {
				$method = updatedMethod as MethodsResponse<Units, ElementsExpanded>
			})
	}
</script>

<div class="col-span-2 bg-white">
	<div class="active-element relative h-full">
		<div class="flex flex-col h-full items-center">
			<ElementWithMass symbol={element.symbol} mass={element.mass} />
			<button class="inactivate-button" on:click={removeElement}>Remove</button>
		</div>

		<div class="flex flex-col gap-2 items-end">
			<div class="flex gap-1 items-baseline">
				<button
					class={units === "ppb" ? "active-units" : "inactive-units"}
					on:click={() => setUnits(UnitTypes.PPB)}
					disabled={units === "ppb"}>ppb</button
				>

				<button
					class={units === "ppm" ? "active-units" : "inactive-units"}
					on:click={() => setUnits(UnitTypes.PPM)}
					disabled={units === "ppm"}>ppm</button
				>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.active-element {
		@apply border border-gray-800 rounded shadow py-2 px-4 flex items-center justify-around;
	}
	.active-units {
		@apply border border-gray-800 shadow font-bold text-xs pt-0 pb-1 rounded px-2;
	}
	.inactive-units {
		@apply border border-gray-400 shadow text-xs pt-0 pb-1 rounded px-2 border-dotted text-gray-500;
	}
</style>
