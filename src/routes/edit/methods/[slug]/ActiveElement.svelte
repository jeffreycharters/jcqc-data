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
	<div class=" bg-white">
		<div class="active-element relative h-full">
			<div class="flex h-full flex-col items-center">
				<ElementWithMass symbol={methodElement.symbol} mass={methodElement.mass} />
				<button class="inactivate-button" on:click={removeElement}>Remove</button>
			</div>

			<div class="flex flex-col items-end gap-2">
				<div class="flex items-baseline gap-1">
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
		@apply flex items-center justify-around rounded border border-gray-800 px-4 py-2 shadow;
	}
	.active {
		@apply rounded border border-gray-800 px-2 pb-1 pt-0 text-xs font-bold shadow;
	}
	.inactive {
		@apply rounded border border-dotted border-gray-400 px-2 pb-1 pt-0 text-xs text-gray-500 shadow;
	}
</style>
