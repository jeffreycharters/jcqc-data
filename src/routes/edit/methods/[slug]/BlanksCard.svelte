<script lang="ts">
	import EditIcon from "$lib/components/EditIcon.svelte"
	import BlankElement from "./BlankElement.svelte"
	import { crossfade, fade } from "svelte/transition"
	import { flip } from "svelte/animate"

	// @ts-expect-error
	import IconTrash from "@tabler/icons-svelte/dist/svelte/icons/IconTrash.svelte"
	import { db, type Blank } from "$lib/db"
	import {
		getBlanksContext,
		getElementsContext,
		getMethodElementsContext,
		setBlankContext
	} from "$lib/storage"
	import { derived } from "svelte/store"

	// @ts-expect-error
	import IconDeviceFloppy from "@tabler/icons-svelte/dist/svelte/icons/IconDeviceFloppy.svelte"
	import { z } from "zod"

	const schema = z
		.object({
			name: z
				.string({ required_error: "Name is required" })
				.min(1, "Name must be at least 1 character"),
			mdls: z.record(z.string(), z.coerce.number({ invalid_type_error: "Invalid MDL" })),
			loqs: z.record(z.string(), z.coerce.number({ invalid_type_error: "Invalid LOQ" }))
		})
		.superRefine((data, ctx) => {
			for (const elementID of Object.keys(data.loqs)) {
				if (data.mdls[elementID] - data.loqs[elementID] > 0) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `MDL is greater than LOQ for ${elementID}`
					})
				}
			}
		})

	export let blank: Blank
	let { name } = blank

	setBlankContext(blank)
	const elements = getElementsContext()
	const methodElements = getMethodElementsContext()
	const blanks = getBlanksContext()

	const usedElementIDs = derived(methodElements, ($methodElements) =>
		($methodElements ?? []).map((methodElement) => methodElement.element)
	)

	const [send, receive] = crossfade({
		duration: 250
	})

	let statusMessage = ""
	let editing = false

	let timer: NodeJS.Timeout
	function setStatusMessage(message: string) {
		statusMessage = message
		timer = setTimeout(() => (statusMessage = ""), 1500)
	}

	const deleteBlank = async () => {
		db.blanks.delete(blank.id).then(() => {
			$blanks = $blanks?.filter((b) => b.id !== blank.id) ?? []
		})
	}

	const updateName = async () => {
		db.blanks.update(blank.id, { name }).then(() => {
			editing = false
			$blanks = [...($blanks ?? []).filter((b) => b.id !== blank.id), { ...blank, name }].toSorted(
				(a, b) => (a.name < b.name ? -1 : 1)
			)
		})
	}

	function updateDetectionLimits() {
		const fd = schema.safeParse(blank)

		if (!fd.success) {
			statusMessage = fd.error.issues.map((i) => i.message).join(". ")
			return
		}

		db.blanks.update(blank.id, fd.data).then(() => {
			setStatusMessage("Changes saved!")
		})
	}
</script>

<div class="basic-border h-full w-full bg-white p-4">
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-baseline gap-2">
			<form
				class="flex items-center {editing ? 'gap-1' : 'gap-2'}"
				on:submit|preventDefault={updateName}
			>
				{#if editing}
					<label for="check-name">Name:</label>
					<input class="basic-border px-2" type="text" bind:value={name} />
					<input type="submit" value="Update" class="btn" />
				{:else}
					<h3>{blank.name}</h3>
				{/if}
				<button type="button" on:click={() => (editing = !editing)} class={editing ? "btn" : ""}>
					{#if editing}
						Cancel
					{:else}
						<EditIcon classes="stroke-gray-400 h-5 w-5" strokeWidth="1.75" />
					{/if}
				</button>
			</form>
		</div>
		<button on:click={deleteBlank}>
			<IconTrash class="h-8 w-8 stroke-red-700 p-1" />
		</button>
	</div>

	<form on:submit|preventDefault={updateDetectionLimits}>
		<div class="grid grid-cols-6 gap-4 text-center">
			{#each ($elements ?? [])
				.filter((element) => $usedElementIDs.includes(element.id))
				.toSorted((a, b) => a.mass - b.mass) as element (element.id)}
				<div
					in:receive|local={{ key: element.id }}
					out:send|local={{ key: element.id }}
					animate:flip={{ duration: 200 }}
				>
					<BlankElement
						{element}
						bind:mdl={blank.mdls[element.id]}
						bind:loq={blank.loqs[element.id]}
					/>
				</div>
			{/each}
		</div>

		<div class="mt-4 flex items-center gap-4">
			<button
				type="submit"
				class="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm text-white"
			>
				<IconDeviceFloppy class="h-5 w-5 stroke-[1.5]" />
				Save
			</button>

			{#if statusMessage}
				<div
					class="w-fit text-sm italic text-{statusMessage.includes('saved') ? 'green' : 'red'}-600"
					class:font-semibold={statusMessage.includes("saved")}
					in:fade={{ duration: 200 }}
					out:fade={{ duration: 150 }}
				>
					{statusMessage}
				</div>
			{/if}
		</div>
	</form>
</div>
