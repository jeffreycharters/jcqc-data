<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import type { Element } from "$lib/db"
	import { getMethodElementsContext } from "$lib/storage"
	import { derived } from "svelte/store"

	export let element: Element
	export let mdl: number | undefined
	export let loq: number | undefined

	const methodElements = getMethodElementsContext()
	const methodElement = derived(methodElements, ($methodElements) =>
		$methodElements?.find((e) => e.element === element.id)
	)
</script>

<div class="basic-border flex flex-col pt-2">
	<div class="flex h-full items-center justify-center gap-4">
		<ElementWithMass symbol={element.symbol} mass={element.mass} />
		<span class="text-gray-500">{$methodElement?.units}</span>
	</div>
	<div class="flex items-center justify-center gap-2">
		<label for={`${element.id}-mdl`}>MDL:</label>
		<div class="w-16">
			<input
				placeholder="- -"
				step="any"
				type="number"
				bind:value={mdl}
				class="number-input mb-2 mt-1 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
			/>
		</div>
	</div>
	<div class="flex items-center justify-center gap-2">
		<label for={`${element.id}-loq`}>LOQ:</label>
		<div class="w-16">
			<input
				step="any"
				type="text"
				placeholder="- -"
				bind:value={loq}
				class="number-input mb-2 mt-1 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
			/>
		</div>
	</div>
</div>
