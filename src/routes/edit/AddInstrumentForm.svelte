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
	import { getInstrumentsContext, getMethodsContext, setMethodsContext } from "$lib/storage"
	import { createId } from "@paralleldrive/cuid2"

	const schema = z.object({
		name: z
			.string({ required_error: "Name is required" })
			.min(1, "Name must be at least 1 character"),
		autosamplerInfo: z
			.string({ required_error: "Description is required" })
			.min(5, "Autosampler info must be at least 5 characters"),
		serial: z
			.string({ required_error: "Serial number is required" })
			.min(2, "Serial number must be at least 2 characters"),
		softwareVersion: z
			.string({ required_error: "Software version is required" })
			.min(2, "Software version must be at least 2 characters")
	})

	export let show: boolean
	const instruments = getInstrumentsContext()

	let formError = ""
	let name: string
	let autosamplerInfo: string
	let serial: string
	let softwareVersion: string

	const methods = getMethodsContext()
	const dispatch: EventDispatcher<{ close: unknown }> = createEventDispatcher()

	const addMethod = async () => {
		const fd = schema.safeParse({
			name,
			autosamplerInfo,
			serial,
			softwareVersion
		})

		if (!fd.success) return (formError = fd.error.issues[0].message)

		formError = ""

		const newInstrument = {
			id: createId(),
			name: fd.data.name,
			autosamplerInfo: fd.data.autosamplerInfo,
			serial: fd.data.serial,
			softwareVersion: fd.data.softwareVersion,
			active: true
		}

		db.instruments
			.add(newInstrument)
			.then(() => {
				$instruments = [...($instruments ?? []), newInstrument]
				name = ""
				autosamplerInfo = ""
				serial = ""
				softwareVersion = ""
				show = false
			})
			.catch((err) => {
				throw new Error((err as Error).message)
			})
	}
</script>

{#if show}
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
			<div class="flex max-w-md items-end justify-between gap-8">
				<TextInput
					name="name"
					label="Instrument Name"
					placeholder="e.g. 7900-3"
					bind:value={name}
				/>
				<TextInput
					name="autosampler-info"
					label="Autosampler Info"
					placeholder="e.g. So good"
					bind:value={autosamplerInfo}
				/>
			</div>

			<div class="flex max-w-md items-end justify-between gap-8">
				<TextInput
					name="serial"
					label="Serial Number"
					bind:value={serial}
					placeholder="e.g. 8675309JNY"
				/>
				<TextInput
					name="software-version"
					label="Software Version"
					placeholder="e.g. Beep bip"
					bind:value={softwareVersion}
				/>
			</div>

			<div class="flex max-w-md items-end justify-between gap-8">
				<div class="mb-1 mt-4 w-full">
					<button type="submit" class="btn w-full">Add Instrument</button>
				</div>
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
