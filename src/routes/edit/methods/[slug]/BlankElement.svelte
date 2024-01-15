<script lang="ts">
	import ElementWithMass from "$lib/components/ElementWithMass.svelte"
	import { setBlanks } from "$lib/methods"
	import { pb } from "$lib/pocketbase"
	import type { BlanksResponse, DetectionLimitsResponse } from "$lib/pocketbase-types"
	import { methodStore } from "$lib/stores"
	import type { ExpandedBlank, ExpandedDetectionLimit, MethodElement } from "$lib/types"
	import { createEventDispatcher, type EventDispatcher } from "svelte"

	export let element: MethodElement
	export let blank: BlanksResponse<ExpandedBlank>

	const dispatch: EventDispatcher<{ updateStatus: string }> = createEventDispatcher()

	let detectionLimits = blank.expand?.["detectionLimits(blank)"]?.find(
		(detectionLimit) => detectionLimit.element === element.elementID
	)

	let mdlBase = detectionLimits?.mdl
	let mdl = !mdlBase || mdlBase === 0 ? "- -" : mdlBase

	let loqBase = detectionLimits?.loq
	let loq = !loqBase || loqBase === 0 ? "- -" : loqBase

	function debounce(callback: () => void, timeout = 250) {
		let timer: NodeJS.Timeout
		return (...args: any) => {
			clearTimeout(timer)
			timer = setTimeout(() => {
				callback.apply(debounce, args)
			}, timeout)
		}
	}

	const updatedDetectionLimits = async (toUpdate: "mdl" | "loq") => {
		let updatedLimit: DetectionLimitsResponse<ExpandedDetectionLimit>
		if (detectionLimits) {
			updatedLimit = await pb.collection("detectionLimits").update(detectionLimits.id, {
				[toUpdate]: Number(toUpdate === "mdl" ? mdl : loq)
			})
		} else {
			updatedLimit = await pb.collection("detectionLimits").create({
				blank: blank.id,
				element: element.elementID,
				[toUpdate]: Number(toUpdate === "mdl" ? mdl : loq)
			})
		}

		detectionLimits = updatedLimit
		await setBlanks($methodStore!.id)
		dispatch("updateStatus", "Saved!")
	}
</script>

<form class="basic-border flex flex-col pt-2">
	<div class="flex h-full items-center justify-center gap-4">
		<ElementWithMass symbol={element.symbol} mass={element.mass} />
		<span class="text-gray-500">{element.units}</span>
	</div>
	<div class="flex items-center justify-center gap-2">
		<label for={`${element.id}-mdl`}>MDL:</label>
		<div class="w-16">
			<input
				type="text"
				name={`${element.id}-mdl`}
				bind:value={mdl}
				on:input={debounce(() => updatedDetectionLimits("mdl"))}
				on:focus={() => (mdl = mdl === "- -" ? "" : mdl)}
				on:blur={() => (mdl = mdl === "" ? "- -" : mdl)}
				class="number-input mb-2 mt-1 text-center text-sm {mdl === '- -' ? 'text-gray-500' : ''}"
			/>
		</div>
	</div>
	<div class="flex items-center justify-center gap-2">
		<label for={`${element.id}-loq`}>LOQ:</label>
		<div class="w-16">
			<input
				type="text"
				name={`${element.id}-loq`}
				bind:value={loq}
				on:input={debounce(() => updatedDetectionLimits("loq"))}
				on:focus={() => (loq = loq === "- -" ? "" : loq)}
				on:blur={() => (loq = loq === "" ? "- -" : loq)}
				class="number-input mb-2 mt-1 text-center text-sm {loq === '- -' ? 'text-gray-500' : ''}"
			/>
		</div>
	</div>
</form>
