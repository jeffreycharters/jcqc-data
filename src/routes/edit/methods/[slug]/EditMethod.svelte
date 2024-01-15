<script lang="ts">
	import NumberInput from "$lib/components/NumberInput.svelte"
	import TextInput from "$lib/components/TextInput.svelte"
	import { expandMethod } from "$lib/methods"
	import { pb } from "$lib/pocketbase"
	import type { MethodsResponse } from "$lib/pocketbase-types"
	import { methodStore } from "$lib/stores"
	import type { ExpandedMethod } from "$lib/types"
	import { fade, slide } from "svelte/transition"
	// @ts-expect-error
	import IconChevronsRight from "@tabler/icons-svelte/dist/svelte/icons/IconChevronsRight.svelte"

	let formMessage = ""
	let timer: NodeJS.Timeout

	let open = false

	let { name, calibrationCount, description, checkStandardTolerance, rpdLimit } = $methodStore || {}

	const addFormMessage = (message: string, timeout: number = 3000) => {
		if (timer) clearTimeout(timer)
		formMessage = message
		timer = setTimeout(() => (formMessage = ""), timeout)
	}

	const editMethod = async () => {
		if (!$methodStore?.name || !$methodStore?.calibrationCount) {
			addFormMessage("Missing something")
			return
		}

		pb.collection("methods")
			.update($methodStore.id, {
				name,
				calibrationCount,
				description,
				checkStandardTolerance,
				rpdLimit,
				expand: expandMethod
			})
			.then((updatedMethod) => {
				$methodStore = updatedMethod as MethodsResponse<ExpandedMethod>
				addFormMessage("Saved!")
			})
			.catch((err) => {
				addFormMessage((err as Error).message)
			})
	}

	function debounce(callback: () => void, timeout = 1000) {
		return (...args: any) => {
			addFormMessage("Changes pending...")
			clearTimeout(timer)
			timer = setTimeout(() => {
				callback.apply(debounce, args)
			}, timeout)
		}
	}

	const processUpdate = () => debounce(editMethod)
</script>

<div class="basic-border my-4 w-full bg-stone-100">
	<div class="flex items-end gap-4">
		<button class="flex w-full items-center gap-2 px-8 py-4" on:click={() => (open = !open)}>
			<IconChevronsRight class="h-5 w-5 stroke-gray-400 transition-all {open ? 'rotate-90' : ''}" />

			<h2>Edit Method</h2>
			{#if formMessage}
				<div
					class="w-fit text-sm italic text-amber-600"
					in:fade={{ duration: 200 }}
					out:fade={{ duration: 150 }}
				>
					{formMessage}
				</div>
			{/if}
		</button>
	</div>

	{#if open}
		<form
			on:input={processUpdate()}
			on:submit|preventDefault
			transition:slide={{ duration: 200 }}
			class="mx-8 mb-8"
		>
			<div class="grid grid-cols-2">
				<TextInput
					name="method-name"
					placeholder="e.g. TOXI-064 or Serum Iodine"
					bind:value={name}
					label="Method Name"
				/>
				<TextInput
					name="description"
					placeholder="e.g. Metals in serum"
					bind:value={description}
					label="Method Description"
				/>
				<NumberInput
					name="cal-count"
					label="Number of non-blank calibration standards"
					bind:value={calibrationCount}
					placeholder="e.g. 6"
				/>
				<NumberInput
					name="rpd-limit"
					label="RPD Warning limit (%)"
					bind:value={rpdLimit}
					placeholder="e.g. 15"
				/>
				<NumberInput
					name="check-standard-limit"
					label="Check Standard Tolerance (%)"
					bind:value={checkStandardTolerance}
					placeholder="e.g. 15"
				/>
			</div>
		</form>
	{/if}
</div>
