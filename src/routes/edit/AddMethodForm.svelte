<script lang="ts">
	import NumberInput from "$lib/components/NumberInput.svelte"
	import TextInput from "$lib/components/TextInput.svelte"
	import { createEventDispatcher, type EventDispatcher } from "svelte"
	import slugify from "slugify"
	import { slide } from "svelte/transition"
	import { z } from "zod"
	// @ts-expect-error
	import IconSquareX from "@tabler/icons-svelte/dist/svelte/icons/IconSquareX.svelte"
	import { db } from "$lib/db"
	import { getMethodsContext, setMethodsContext } from "$lib/storage"

	const schema = z.object({
		name: z
			.string({ required_error: "Name is required" })
			.min(5, "Name must be at least 5 characters"),
		description: z
			.string({ required_error: "Description is required" })
			.min(5, "Description must be at least 5 characters"),
		checkStandardTolerance: z.coerce
			.number({
				required_error: "Check STD tolerance is required",
				invalid_type_error: "Invalid Check STD tolerance"
			})
			.min(1, "Check STD tolerance must be greater than 0")
			.max(100, "Check STD tolerance must be less than 100"),
		rpdLimit: z.coerce
			.number({
				required_error: "RPD limit is required",
				invalid_type_error: "Invalid RPD limit"
			})
			.min(1, "RPD limit must be > 0")
			.max(100, "RPD limit must be < 100"),
		calibrationCount: z.coerce
			.number({
				required_error: "Calibration STD count is required",
				invalid_type_error: "Invalid Calibration STD count"
			})
			.min(1, "Calibration STD count must be greater than 0")
			.max(100, "Calibration STD count must be less than 100"),
		reportSigFigs: z.coerce
			.number({
				required_error: "Report Sig Figs is required",
				invalid_type_error: "Invalid Report Sig Figs"
			})
			.min(1, "Report Sig Figs must be greater than 0")
			.max(5, "Report Sig Figs must 5 or less")
	})

	export let showAddForm: boolean

	let formError = ""
	let name: string
	let rpdLimit: number
	let calibrationCount: number
	let description: string
	let checkStandardTolerance: number
	let reportSigFigs: number

	const methods = getMethodsContext()
	const dispatch: EventDispatcher<{ close: unknown }> = createEventDispatcher()

	const addMethod = async () => {
		const fd = schema.safeParse({
			name,
			rpdLimit,
			calibrationCount,
			description,
			checkStandardTolerance,
			reportSigFigs
		})

		if (!fd.success) return (formError = fd.error.issues[0].message)

		formError = ""

		const newMethod = {
			...fd.data,
			slug: slugify(name, { lower: true }),
			active: true
		}

		db.methods
			.add(newMethod)
			.then(() => {
				$methods = [...($methods ?? []), newMethod]
				name = ""
				description = ""
			})
			.catch((err) => {
				throw new Error((err as Error).message)
			})
	}
</script>

{#if showAddForm}
	<div
		class="my-4 mb-8 w-fit rounded border border-gray-900 bg-white p-4 shadow"
		transition:slide={{ duration: 200 }}
	>
		<div class="flex items-center justify-between">
			<h2>Add new</h2>
			<button on:click={() => dispatch("close")}>
				<IconSquareX class="h-6 w-6 stroke-stone-500" />
			</button>
		</div>
		<form on:submit|preventDefault={addMethod}>
			<TextInput name="name" label="Method Name" placeholder="e.g. TOXI-064" bind:value={name} />
			<TextInput
				name="name"
				label="Method Description"
				placeholder="e.g. Metals in sewage"
				bind:value={description}
			/>
			<div class="flex max-w-md items-end justify-between gap-8">
				<NumberInput
					name="check-standard-limit"
					label="Check Standard Tolerance (%)"
					bind:value={checkStandardTolerance}
					placeholder="e.g. 15"
				/>
				<NumberInput
					name="rpd-limit"
					label="Duplicate RPD limit (%)"
					bind:value={rpdLimit}
					placeholder="e.g. 20"
				/>
			</div>

			<div class="flex max-w-md items-end justify-between gap-8">
				<NumberInput
					name="cal-count"
					label="Non-blank calibration standards"
					placeholder="e.g. 6"
					bind:value={calibrationCount}
				/>
				<NumberInput
					name="sigfigs"
					label="Report sig figs"
					placeholder="e.g. 2"
					bind:value={reportSigFigs}
				/>
			</div>

			<div class="mb-1 w-full">
				<button type="submit" class="btn w-full">Add Method</button>
			</div>
			<div class="w-fit">
				{#if formError}
					<div transition:slide={{ duration: 200 }} class="ml-2 text-sm italic text-red-600">
						{formError}
					</div>
				{/if}
			</div>
		</form>
	</div>
{/if}
