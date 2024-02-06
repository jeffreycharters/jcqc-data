<script lang="ts">
	import EditIcon from "$lib/components/EditIcon.svelte"
	import ReferenceMaterialElement from "./ReferenceMaterialElement.svelte"
	import { fade } from "svelte/transition"
	import { createSwitch, melt } from "@melt-ui/svelte"
	import { derived, writable } from "svelte/store"
	import { db, type ReferenceMaterial } from "$lib/db"
	import {
		getElementsContext,
		getMethodElementsContext,
		getReferenceMaterialsContext,
		setReferenceMaterialContext
	} from "$lib/storage"

	// @ts-expect-error
	import IconDeviceFloppy from "@tabler/icons-svelte/dist/svelte/icons/IconDeviceFloppy.svelte"

	// @ts-expect-error
	import IconTrash from "@tabler/icons-svelte/dist/svelte/icons/IconTrash.svelte"
	import { z } from "zod"

	const schema = z
		.object({
			name: z
				.string({ required_error: "Name is required" })
				.min(1, "Name must be at least 1 character"),
			active: z.boolean().default(true),
			lower: z.record(z.string(), z.coerce.number({ invalid_type_error: "Invalid range" })),
			upper: z.record(z.string(), z.coerce.number({ invalid_type_error: "Invalid range" }))
		})
		.superRefine((data, ctx) => {
			for (const elementID of Object.keys(data.lower)) {
				if (data.lower[elementID] - data.upper[elementID] > 0) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Low value is greater than high for ${elementID}`
					})
				}
			}
		})

	export let referenceMaterial: ReferenceMaterial
	let { name } = referenceMaterial

	const active = writable(referenceMaterial.active)

	setReferenceMaterialContext(referenceMaterial)
	const elements = getElementsContext()
	const methodElements = getMethodElementsContext()
	const referenceMaterials = getReferenceMaterialsContext()

	const usedElementIDs = derived(methodElements, ($methodElements) =>
		($methodElements ?? []).map((methodElement) => methodElement.element)
	)

	const {
		elements: { root, input }
	} = createSwitch({ checked: active })

	active.subscribe((value) => {
		if (value === referenceMaterial.active) return

		db.referenceMaterials.update(referenceMaterial.id, { active: value }).then(() => {
			$referenceMaterials = [
				...($referenceMaterials ?? []).filter((rm) => rm.id !== referenceMaterial.id),
				{ ...referenceMaterial, active: value }
			].toSorted((a, b) => (a.name < b.name ? 1 : -1))
		})
	})

	let statusMessage = ""
	let editing = false

	let timer: NodeJS.Timeout
	const statusUpdate = (message: string, timeout = 1500) => {
		if (timer) clearTimeout(timer)

		statusMessage = message
		timer = setTimeout(() => (statusMessage = ""), timeout)
	}

	const deleteCheckStandard = async () => {
		db.checkStandards.delete(referenceMaterial.id).then(() => {
			$referenceMaterials = [
				...($referenceMaterials ?? []).filter((rm) => rm.id !== referenceMaterial.id)
			]
		})
	}

	const updateName = async () => {
		db.referenceMaterials.update(referenceMaterial.id, { name }).then(() => {
			$referenceMaterials = [
				...($referenceMaterials ?? []).filter((rm) => rm.id !== referenceMaterial.id),
				{ ...referenceMaterial, name }
			].toSorted((a, b) => (a.name < b.name ? 1 : -1))
			editing = false
		})
	}

	function updateRanges() {
		const fd = schema.safeParse(referenceMaterial)

		if (!fd.success) {
			statusMessage = fd.error.issues.map((i) => i.message).join(". ")
			return
		}

		db.referenceMaterials.update(referenceMaterial.id, fd.data).then(() => {
			$referenceMaterials = [
				...($referenceMaterials ?? []).filter((rm) => rm.id !== referenceMaterial.id),
				referenceMaterial
			].toSorted((a, b) => (a.name < b.name ? -1 : 1))
			statusUpdate("Changes saved!")
		})
	}
</script>

<div class="basic-border h-full w-full bg-white p-4">
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center gap-2">
			{#if editing}
				<form
					class="flex items-center {editing ? 'gap-1' : 'gap-2'}"
					on:submit|preventDefault={updateName}
				>
					<label for="check-name">Name:</label>
					<input class="basic-border px-2" type="text" bind:value={name} />
					<input type="submit" value="Update" class="btn !mb-0 !py-0" />
				</form>
			{:else}
				<h3>{name}</h3>
			{/if}
			<button
				type="button"
				on:click={() => (editing = !editing)}
				class:btn={editing}
				class="!mb-0 !py-0"
			>
				{#if editing}
					Cancel
				{:else}
					<EditIcon classes="stroke-gray-400 h-5 w-5" strokeWidth="1.75" />
				{/if}
			</button>
			<div class="flex items-center gap-2">
				<button
					use:melt={$root}
					class="toggler relative h-5 cursor-default rounded-full bg-stone-400 transition-colors data-[state=checked]:bg-green-600"
					id="airplane-mode"
					aria-labelledby="airplane-mode-label"
				>
					<span
						class="thumb block rounded-full transition {$active ? 'bg-green-100' : 'bg-stone-100'}"
					/>
				</button>
				<input use:melt={$input} />
				{#key $active}
					<label
						in:fade={{ duration: 100, delay: 100 }}
						out:fade={{ duration: 100 }}
						class="leading-none {$active ? 'text-emerald-600' : 'text-stone-400'}"
						for="airplane-mode"
						id="airplane-mode-label"
					>
						{$active ? "Active" : "Inactive"}
					</label>
				{/key}
			</div>
		</div>

		<button on:click={deleteCheckStandard}>
			<IconTrash class="h-8 w-8 stroke-red-700 p-1" />
		</button>
	</div>

	<form on:submit|preventDefault={updateRanges}>
		<div class="grid grid-cols-6 gap-4 text-center">
			{#each ($elements ?? [])
				.filter((element) => $usedElementIDs.includes(element.id))
				.toSorted((a, b) => a.mass - b.mass) as element (element.id)}
				<ReferenceMaterialElement
					{element}
					bind:lower={referenceMaterial.lower[element.id]}
					bind:upper={referenceMaterial.upper[element.id]}
				/>
			{/each}
		</div>
		<div class="mt-4 flex items-center gap-4">
			<button
				type="submit"
				class="inline-flex w-fit items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm text-white"
			>
				<IconDeviceFloppy class="h-5 w-5  stroke-[1.5]" />
				Save
			</button>

			{#if statusMessage}
				<div
					class="text-sm italic text-{statusMessage.includes('saved') ? 'green' : 'red'}-600"
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

<style>
	button.toggler {
		--w: 2.25rem;
		--padding: 0.125rem;
		width: var(--w);
	}
	.thumb {
		--size: 1rem;
		width: var(--size);
		height: var(--size);
		transform: translateX(var(--padding));
	}

	:global([data-state="checked"]) .thumb {
		transform: translateX(calc(var(--w) - var(--size) - var(--padding)));
	}
</style>
