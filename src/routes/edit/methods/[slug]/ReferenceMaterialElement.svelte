<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import type { Element } from "$lib/db"
	import { getMethodElementsContext } from "$lib/storage"
	import { derived } from "svelte/store"

	export let element: Element
	export let lower: number | undefined
	export let upper: number | undefined

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
	<table class="border-collapse">
		<tr>
			<td class="pb-1 pr-2 text-right">
				<label for={`${$methodElement?.element}-lower`}>Low:</label>
			</td>
			<td>
				<div class="w-16">
					<input
						type="number"
						name={`${$methodElement?.element}-lower`}
						bind:value={lower}
						placeholder="- -"
						step="any"
						class="number-input mb-2 mt-1 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
					/>
				</div>
			</td>
		</tr>
		<tr>
			<td class="pb-1 pr-2 text-right">
				<label for={`${$methodElement?.element}-upper`}>High:</label>
			</td>
			<td>
				<div class="w-16">
					<input
						type="text"
						step="any"
						name={`${$methodElement?.element}-upper`}
						bind:value={upper}
						placeholder="- -"
						class="number-input mb-2 mt-1 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
					/>
				</div>
			</td>
		</tr>
	</table>
</div>
