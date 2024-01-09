<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import { pb } from "$lib/pocketbase"
	import { availableUnits, setMethodElements } from "$lib/elements"
	import type { MethodElement, Units } from "$lib/types"
	import { methodStore } from "$lib/stores"
	export let methodElement: MethodElement | undefined

	async function removeElement() {
		await pb.collection("methodElements").delete(methodElement!.id)

		await setMethodElements($methodStore!.id)
	}

	const setUnits = async (newUnits: Units) => {
		await pb.collection("methodElements").update(methodElement!.id!, {
			units: newUnits,
			expand: "element"
		})

		await setMethodElements($methodStore!.id)
	}
</script>

{#if methodElement}
	<div class="col-span-2 bg-white">
		<div class="active-element relative h-full">
			<div class="flex flex-col h-full items-center">
				<ElementWithMass symbol={methodElement.symbol} mass={methodElement.mass} />
				<button class="inactivate-button" on:click={removeElement}>Remove</button>
			</div>

			<div class="flex flex-col gap-2 items-end">
				<div class="flex gap-1 items-baseline">
					{#each availableUnits as unit}
						<button
							class={methodElement.units === unit ? "active" : "inactive"}
							on:click={() => setUnits(unit)}
							disabled={methodElement.units === unit}>{unit}</button
						>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.active-element {
		@apply border border-gray-800 rounded shadow py-2 px-4 flex items-center justify-around;
	}
	.active {
		@apply border border-gray-800 shadow font-bold text-xs pt-0 pb-1 rounded px-2;
	}
	.inactive {
		@apply border border-gray-400 shadow text-xs pt-0 pb-1 rounded px-2 border-dotted text-gray-500;
	}
</style>
