<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import { pb } from "$lib/pocketbase"
	import { availableUnits, setMethodElements } from "$lib/elements"
	import type { MethodElement, Units } from "$lib/types"
	import { methodStore } from "$lib/stores"
	export let methodElement: MethodElement | undefined

	// @ts-expect-error
	import IconTrashX from "@tabler/icons-svelte/dist/svelte/icons/IconTrashX.svelte"

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
	<div
		class="flex h-full w-full items-center justify-around rounded border border-gray-800 bg-white p-2 shadow"
	>
		<button on:click={removeElement}>
			<IconTrashX class="h-8 w-8 rounded-full stroke-red-700 p-1 hover:bg-red-100" />
		</button>
		<ElementWithMass
			symbol={methodElement.symbol}
			mass={methodElement.mass}
			class="text-2xl font-bold"
		/>

		<div class="flex flex-col items-end gap-2">
			<div class="mx-auto flex items-baseline gap-1">
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
{/if}

<style lang="postcss">
	.active {
		@apply rounded border border-gray-800 px-2 pb-1 pt-0 text-xs font-bold shadow;
	}
	.inactive {
		@apply rounded border border-dotted border-gray-400 px-2 pb-1 pt-0 text-xs text-gray-500 shadow;
	}
</style>
