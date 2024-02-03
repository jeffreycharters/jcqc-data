<script lang="ts">
	import NumberInput from "$lib/components/NumberInput.svelte"
	import TextInput from "$lib/components/TextInput.svelte"
	import { fade, slide } from "svelte/transition"
	import { z } from "zod"
	import { getMethodContext } from "$lib/storage"

	// @ts-expect-error
	import IconChevronsRight from "@tabler/icons-svelte/dist/svelte/icons/IconChevronsRight.svelte"

	// @ts-expect-error
	import IconDeviceFloppy from "@tabler/icons-svelte/dist/svelte/icons/IconDeviceFloppy.svelte"
	import { db } from "$lib/db"
	import slugify from "slugify"

	const method = getMethodContext()

	let formMessage = ""
	let timer: NodeJS.Timeout

	let open = false

	let { name, calibrationCount, description, checkStandardTolerance, rpdLimit, reportSigFigs } =
		$method || {}

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

		if (!fd.success) return addFormMessage(fd.error.issues[0].message)

		db.methods
			.update($method?.slug, {
				...fd.data,
				active: $method?.active,
				slug: slugify(fd.data.name, { lower: true })
			})
			.then(() => {
				addFormMessage("Method parameters saved!")
			})
			.catch((err) => {
				addFormMessage((err as Error).message)
			})
	}
</script>

<div class="basic-border my-4 w-full bg-stone-100">
	<div class="flex items-end gap-4">
		<button class="flex w-full items-center gap-2 px-8 py-4" on:click={() => (open = !open)}>
			<IconChevronsRight class="h-5 w-5 stroke-gray-400 transition-all {open ? 'rotate-90' : ''}" />

			<h2>Edit Method</h2>
		</button>
	</div>

	{#if open}
		<form
			on:submit|preventDefault={editMethod}
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

			<div class="mt-4 flex items-center gap-4">
				<button
					type="submit"
					class="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm text-white"
				>
					<IconDeviceFloppy class="h-5 w-5 stroke-[1.5]" />
					Save
				</button>

				{#if formMessage}
					<div
						class="w-fit text-sm italic text-{formMessage.includes('saved') ? 'green' : 'red'}-600"
						class:font-semibold={formMessage.includes("saved")}
						in:fade={{ duration: 200 }}
						out:fade={{ duration: 150 }}
					>
						{formMessage}
					</div>
				{/if}
			</div>
		</form>
	{/if}
</div>
