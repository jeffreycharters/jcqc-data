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
	import { z } from "zod"

	let formMessage = ""
	let timer: NodeJS.Timeout

	let open = false

	let { name, calibrationCount, description, checkStandardTolerance, rpdLimit, reportSigFigs } =
		$methodStore || {}

	const schema = z.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		calibrationCount: z.coerce
			.number({
				required_error: "Calibration count is required",
				invalid_type_error: "Invalid Calibration count"
			})
			.min(1, "Calibration count must be at least 1"),
		description: z
			.string({
				required_error: "Description is required",
				invalid_type_error: "Invalid Description"
			})
			.min(2, "Description must be at least 2 characters"),
		checkStandardTolerance: z.coerce
			.number({
				required_error: "Check STD tolerance is required",
				invalid_type_error: "Invalid Check STD tolerance"
			})
			.min(1, "Check STD tolerance must be at least 1"),
		rpdLimit: z.coerce
			.number({
				required_error: "RPD limit is required",
				invalid_type_error: "Invalid RPD limit"
			})
			.min(1, "RPD limit must be at least 1"),
		reportSigFigs: z.coerce
			.number({
				required_error: "Report Sig Figs is required",
				invalid_type_error: "Invalid Report Sig Figs"
			})
			.min(1, "Report Sig Figs must be at least 1")
	})

	const addFormMessage = (message: string, timeout: number = 3000) => {
		if (timer) clearTimeout(timer)
		formMessage = message
		timer = setTimeout(() => (formMessage = ""), timeout)
	}

	const editMethod = async () => {
		const fd = schema.safeParse({
			name,
			calibrationCount,
			description,
			checkStandardTolerance,
			rpdLimit,
			reportSigFigs
		})

		if (!fd.success) return (formMessage = fd.error.issues[0].message)

		pb.collection("methods")
			.update($methodStore!.id, {
				...fd.data,
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
				<NumberInput
					name="sig-figs"
					label="Significant figures on report"
					bind:value={reportSigFigs}
					placeholder="e.g. 2"
				/>
			</div>
		</form>
	{/if}
</div>
