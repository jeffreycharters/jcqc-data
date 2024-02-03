<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import { db, type Element } from "$lib/db"
	import { getMethodContext, getMethodElementsContext } from "$lib/storage"
	import type { Units } from "$lib/types"

	// @ts-expect-error
	import IconSquareRoundedPlus from "@tabler/icons-svelte/dist/svelte/icons/IconSquareRoundedPlus.svelte"

	export let element: Element
	const method = getMethodContext()
	const methodElements = getMethodElementsContext()

	async function addElement() {
		const newMethodElement = {
			element: element.id,
			method: $method?.slug ?? "",
			units: "ppm" as Units
		}

		db.methodElements.add(newMethodElement).then(() => {
			$methodElements = [...($methodElements ?? []), newMethodElement]
		})
	}
</script>

<button
	class="basic-border inactive-element flex h-full w-full items-center justify-center bg-white"
	on:click={addElement}
>
	<div class="flex w-full items-center justify-evenly gap-2">
		<ElementWithMass symbol={element.symbol} mass={element.mass} class="text-xl font-bold" />

		<div class="flex items-center gap-1 font-semibold">
			<IconSquareRoundedPlus class="h-4 w-4" />
			<span>Activate</span>
		</div>
	</div>
</button>

<style lang="postcss">
	.inactive-element {
		@apply flex items-center justify-around rounded border border-gray-300 px-4 py-2 text-gray-400 shadow;
	}
</style>
