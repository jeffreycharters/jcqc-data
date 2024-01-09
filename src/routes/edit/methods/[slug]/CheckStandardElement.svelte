<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import { pb } from "$lib/pocketbase"
	import type { CheckStandardsResponse, CheckValuesResponse } from "$lib/pocketbase-types"
	import type { ExpandedCheckStandard, MethodElement } from "$lib/types"
	import { createEventDispatcher, type EventDispatcher } from "svelte"

	export let checkStandard: CheckStandardsResponse<ExpandedCheckStandard>
	export let element: MethodElement

	const dispatch: EventDispatcher<{ updateStatus: string }> = createEventDispatcher()

	let checkValue = checkStandard.expand?.["checkValues(checkStandard)"].find(
		(cv) => cv.element === element.elementID
	)

	let rawValue = checkValue?.value
	let value = !rawValue || rawValue === 0 ? "- -" : rawValue

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

	const updateCalCheck = async () => {
		let updatedCheckValue: CheckValuesResponse<ExpandedCheckStandard>
		if (checkValue) {
			updatedCheckValue = await pb
				.collection("checkValues")
				.update(checkValue.id, { value: value, expand: "checkValues(checkStandard)" })
		} else {
			updatedCheckValue = await pb.collection("checkValues").create({
				value,
				element: element.elementID,
				checkStandard: checkStandard.id
			})
		}

		checkValue = updatedCheckValue
		dispatch("updateStatus", "Saved!")
	}

	const processUpdate = () => debounce(() => updateCalCheck())
</script>

<form class="basic-border flex flex-col pt-2">
	<div class="flex items-center justify-center h-full gap-4">
		<ElementWithMass symbol={element.symbol} mass={element.mass} />
		<span class="text-gray-500">{element.units}</span>
	</div>
	<div class="flex items-center gap-2 justify-center">
		<label for={`${element.id}-mdl`}>Expect:</label>
		<div class="w-16">
			<input
				type="text"
				name={`${element.id}-value`}
				bind:value
				on:keypress={processUpdate()}
				on:focus={() => (value = value === "- -" ? "" : value)}
				on:blur={() => (value = value === "" ? "- -" : value)}
				class="number-input mt-1 mb-2 text-sm text-center {value === '- -' ? 'text-gray-500' : ''}"
			/>
		</div>
	</div>
</form>
