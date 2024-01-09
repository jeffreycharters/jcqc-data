<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import { pb } from "$lib/pocketbase"
	import type {
		ReferenceMaterialsRangesResponse,
		ReferenceMaterialsResponse
	} from "$lib/pocketbase-types"
	import type { ExpandedReferenceMaterial, MethodElement } from "$lib/types"
	import { createEventDispatcher, type EventDispatcher } from "svelte"

	export let referenceMaterial: ReferenceMaterialsResponse<ExpandedReferenceMaterial>
	export let methodElement: MethodElement

	const dispatch: EventDispatcher<{ updateStatus: string }> = createEventDispatcher()

	let range = referenceMaterial?.expand?.["referenceMaterialsRanges(referenceMaterial)"].find(
		(rm) => rm.element === methodElement.elementID
	)

	let lowerBase = range?.lower
	let lower = !lowerBase || lowerBase === 0 ? "- -" : lowerBase
	let upperBase = range?.upper
	let upper = !upperBase || upperBase === 0 ? "- -" : upperBase

	function debounce(callback: () => void, timeout = 250) {
		let timer: number
		return (...args: any) => {
			dispatch("updateStatus", "Pending...")
			clearTimeout(timer)
			timer = setTimeout(() => {
				callback.apply(debounce, args)
			}, timeout)
		}
	}

	const updateReferenceMaterial = async (toUpdate: "lower" | "upper") => {
		let updatedReferenceMaterial: ReferenceMaterialsRangesResponse<ExpandedReferenceMaterial>
		if (range && toUpdate === "lower" && lower === 0) {
			updatedReferenceMaterial = await pb
				.collection("referenceMaterialsRanges")
				.update(range.id, { lower: 0 })
		} else if (range && toUpdate === "upper" && lower === 0) {
			updatedReferenceMaterial = await pb
				.collection("referenceMaterialsRanges")
				.update(range.id, { upper: 0 })
		} else if (range) {
			updatedReferenceMaterial = await pb.collection("referenceMaterialsRanges").update(range.id, {
				[toUpdate]: Number(toUpdate === "lower" ? lower : upper),
				expand: "checkValues(checkStandard)"
			})
		} else {
			updatedReferenceMaterial = await pb.collection("referenceMaterialsRanges").create({
				[toUpdate]: Number(toUpdate === "lower" ? lower : upper),
				element: methodElement.elementID,
				referenceMaterial: referenceMaterial.id
			})
		}

		range = updatedReferenceMaterial
		dispatch("updateStatus", "Saved!")
	}

	const processUpdate = (toUpdate: "lower" | "upper") =>
		debounce(() => updateReferenceMaterial(toUpdate))
</script>

<form class="basic-border flex flex-col pt-2">
	<div class="flex items-center justify-center h-full gap-4">
		<ElementWithMass symbol={methodElement.symbol} mass={methodElement.mass} />
		<span class="text-gray-500">{methodElement.units}</span>
	</div>
	<table class="border-collapse">
		<tr>
			<td class="text-right pr-2 pb-1">
				<label for={`${methodElement.id}-lower`}>Low:</label>
			</td>
			<td>
				<div class="w-16">
					<input
						type="text"
						name={`${methodElement.id}-lower`}
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
				<label for={`${methodElement.id}-upper`}>High:</label>
			</td>
			<td>
				<div class="w-16">
					<input
						type="text"
						name={`${methodElement.id}-upper`}
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
