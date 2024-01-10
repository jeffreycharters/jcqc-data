<script lang="ts">
	import NumberInput from "$lib/components/NumberInput.svelte"
	import TextInput from "$lib/components/TextInput.svelte"
	import { pb } from "$lib/pocketbase"
	import { createEventDispatcher, type EventDispatcher } from "svelte"
	import slugify from "slugify"
	import { IconSquareX } from "@tabler/icons-svelte"
	import { slide } from "svelte/transition"
	import { setMethods } from "$lib/methods"

	export let showAddForm: boolean

	let formError = ""
	let name: string
	let rpdLimit: number
	let calibrationCount = 1
	let description: string
	let checkStandardTolerance: number

	const dispatch: EventDispatcher<{ close: unknown }> = createEventDispatcher()

	const addMethod = async () => {
		if (!name || !calibrationCount) formError = "Missing something"

		pb.collection("methods")
			.create({
				name,
				slug: slugify(name, { lower: true }),
				rpdLimit,
				active: true,
				calibrationCount,
				description,
				checkStandardTolerance
			})
			.then(async () => {
				await setMethods()
				name = ""
				rpdLimit = 0
			})
			.catch((err) => {
				throw new Error((err as Error).message)
			})
	}
</script>

{#if showAddForm}
	<div
		class="border border-gray-900 w-fit p-4 rounded shadow my-4 bg-white mb-8"
		transition:slide={{ duration: 200 }}
	>
		<div class="flex justify-between items-center">
			<h2>Add new</h2>
			<button on:click={() => dispatch("close")}>
				<IconSquareX size={24} stroke={1.5} class="stroke-stone-500" />
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
			<div class="flex gap-8 max-w-md items-end">
				<NumberInput
					name="cal-count"
					label="Number of non-blank calibration standards"
					bind:value={calibrationCount}
				/>
				<NumberInput
					name="rpd-limit"
					label="RPD warning limit (%)"
					bind:value={rpdLimit}
					placeholder="e.g. 20"
				/>
			</div>

			<div class="flex gap-8 my-2 items-end">
				<NumberInput
					name="check-standard-limit"
					label="Check Standard Tolerance (%)"
					bind:value={checkStandardTolerance}
					placeholder="e.g. 15"
				/>
			</div>

			<div class="w-fit ml-auto mr-0 mt-4">
				<button type="submit" class="btn">Add Method</button>
				{#if formError}
					<div style="color: #cc0000">{formError}</div>
				{/if}
			</div>
		</form>
	</div>
{/if}
