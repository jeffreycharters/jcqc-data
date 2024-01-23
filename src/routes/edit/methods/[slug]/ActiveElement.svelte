<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import { pb } from "$lib/pocketbase"
	import { availableUnits, setMethodElements } from "$lib/elements"
	import type { MethodElement, Units } from "$lib/types"
	import { methodStore } from "$lib/stores"
	export let methodElement: MethodElement | undefined

	// @ts-expect-error
	import IconSquareRoundedMinus from "@tabler/icons-svelte/dist/svelte/icons/IconSquareRoundedMinus.svelte"

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
		class="flex h-full w-full items-center justify-between rounded border border-gray-800 bg-white p-2 shadow"
	>
		<button
			on:click={removeElement}
			class="flex items-center gap-1 rounded-full px-2 py-1 hover:bg-red-100"
		>
			<IconSquareRoundedMinus class="h-4 w-4 stroke-red-700" title="remove element" />
			<span class="text-xs text-red-700">Remove</span>
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
