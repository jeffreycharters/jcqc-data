<script lang="ts">
	import type { Analyte } from "$lib/classes"
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import type { ReferenceMaterialsRangesResponse } from "$lib/pocketbase-types"
	import { methodStore } from "$lib/stores"
	import { createEventDispatcher } from "svelte"

	export let element: Analyte
	export let referenceMaterialName: string
	const dispatch = createEventDispatcher()

	let allRanges = $methodStore?.referenceMaterials?.get(referenceMaterialName)?.expand
		?.ranges as ReferenceMaterialsRangesResponse[]

	const range = allRanges?.find((dl) => dl.element === element.id) ?? undefined

	let lowerBase = allRanges?.find((range) => range.element === element.id)?.lower
	let lower = !lowerBase || lowerBase === 0 ? "- -" : lowerBase
	let upperBase = allRanges?.find((range) => range.element === element.id)?.upper
	let upper = !upperBase || upperBase === 0 ? "- -" : upperBase

	function debounce(callback: () => void, timeout = 1000) {
		let timer: number
		return (...args: any) => {
			dispatch("updateStatus", "Pending...")
			clearTimeout(timer)
			timer = setTimeout(() => {
				callback.apply(debounce, args)
			}, timeout)
		}
	}

	const updateCalCheck = async (toUpdate: "lower" | "upper") => {
		// update database
		await$methodStore?.updateReferenceRanges(
			range?.id ?? "",
			toUpdate,
			Number(toUpdate === "lower" ? lower : upper)
		)
		$methodStore = $methodStore
		dispatch("updateStatus", "Saved!")
	}

	const processUpdate = (toUpdate: "lower" | "upper") => debounce(() => updateCalCheck(toUpdate))
</script>

<form class="basic-border flex flex-col pt-2">
	<div class="flex items-center justify-center h-full gap-4">
		<ElementWithMass symbol={element.symbol} mass={element.mass} />
		<span class="text-gray-500">{element.units}</span>
	</div>
	<table class="border-collapse">
		<tr>
			<td class="text-right pr-2 pb-1">
				<label for={`${element.id}-lower`}>Low:</label>
			</td>
			<td>
				<div class="w-16">
					<input
						type="text"
						name={`${element.id}-lower`}
						bind:value={lower}
						on:keypress={processUpdate("lower")}
						on:focus={() => (lower = lower === "- -" ? "" : lower)}
						on:blur={() => (lower = lower === "" ? "- -" : lower)}
						class="number-input mt-1 mb-2 text-sm text-center {lower === '- -'
							? 'text-gray-500'
							: ''}"
					/>
				</div>
			</td>
		</tr>
		<tr>
			<td class="text-right pr-2 pb-1">
				<label for={`${element.id}-upper`}>High:</label>
			</td>
			<td>
				<div class="w-16">
					<input
						type="text"
						name={`${element.id}-upper`}
						bind:value={upper}
						on:keypress={processUpdate("upper")}
						on:focus={() => (upper = upper === "- -" ? "" : upper)}
						on:blur={() => (upper = upper === "" ? "- -" : upper)}
						class="number-input mt-1 mb-2 text-sm text-center {upper === '- -'
							? 'text-gray-500'
							: ''}"
					/>
				</div>
			</td>
		</tr>
	</table>
</form>
