<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import { db, type MethodElement } from "$lib/db"
	import { getElementsContext, getMethodElementsContext } from "$lib/storage"
	import type { Units } from "$lib/types"

	// @ts-expect-error
	import IconSquareRoundedMinus from "@tabler/icons-svelte/dist/svelte/icons/IconSquareRoundedMinus.svelte"
	import { derived } from "svelte/store"

	export let id: string
	const elements = getElementsContext()
	const methodElements = getMethodElementsContext()

	const methodElement = derived(methodElements, ($methodElements) =>
		$methodElements?.find((e) => e.element === id)
	)
	const element = $elements?.find((e) => e.id === $methodElement?.element)

	async function removeElement() {
		db.methodElements.delete([$methodElement?.element, $methodElement?.method]).then(() => {
			$methodElements = ($methodElements ?? []).filter((e) => e.element !== $methodElement?.element)
		})
	}

	const setUnits = async (newUnits: string) => {
		const units = newUnits as Units
		const updated = {
			method: $methodElement?.method ?? "",
			element: $methodElement?.element ?? "",
			units,
			active: true
		}

		db.methodElements
			.update([$methodElement?.element, $methodElement?.method], updated)
			.then(() => {
				$methodElements = [
					...($methodElements ?? []).filter((me) => me.element !== $methodElement?.element),
					updated
				]
			})
			.catch((err) => {
				console.log(err)
			})
	}
</script>

{#if $methodElement}
	<div
		class="flex h-full w-full flex-wrap items-center justify-between rounded border border-gray-800 bg-white p-2 shadow"
	>
		<button
			on:click={removeElement}
			class="flex items-center gap-1 rounded-full px-2 py-1 hover:bg-red-100"
		>
			<IconSquareRoundedMinus class="h-4 w-4 stroke-red-700" title="remove element" />
			<span class="text-xs text-red-700">Remove</span>
		</button>
		<ElementWithMass
			symbol={element?.symbol ?? "??"}
			mass={element?.mass ?? 666}
			class="text-2xl font-bold"
		/>

		<div class="flex flex-col items-end gap-2">
			<div class="mx-auto flex items-baseline gap-1">
				{#each ["ppb", "ppm"] as unit}
					<button
						class={$methodElement.units === unit ? "active" : "inactive"}
						on:click={() => setUnits(unit)}
						disabled={$methodElement.units === unit}>{unit}</button
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
