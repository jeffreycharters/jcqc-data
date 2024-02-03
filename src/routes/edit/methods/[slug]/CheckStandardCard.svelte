<script lang="ts">
	import EditIcon from "$lib/components/EditIcon.svelte"
	import { crossfade } from "svelte/transition"
	import CheckStandardElement from "./CheckStandardElement.svelte"
	import { flip } from "svelte/animate"
	import { fade } from "svelte/transition"
	import { db, type CheckStandard } from "$lib/db"

	// @ts-expect-error
	import IconTrash from "@tabler/icons-svelte/dist/svelte/icons/IconTrash.svelte"
	// @ts-expect-error
	import IconDeviceFloppy from "@tabler/icons-svelte/dist/svelte/icons/IconDeviceFloppy.svelte"
	import {
		getCheckStandardsContext,
		getElementsContext,
		getMethodElementsContext,
		setCheckStandardContext
	} from "$lib/storage"
	import { derived } from "svelte/store"

	export let checkStandard: CheckStandard
	let { name } = checkStandard

	setCheckStandardContext(checkStandard)

	const elements = getElementsContext()
	const methodElements = getMethodElementsContext()
	const checkStandards = getCheckStandardsContext()

	const usedElementIDs = derived(methodElements, ($methodElements) =>
		($methodElements ?? []).map((methodElement) => methodElement.element)
	)

	const [send, receive] = crossfade({ duration: 200 })

	let statusMessage = ""
	let editing = false

	let timer: NodeJS.Timeout
	const statusUpdate = (message: string, timeout = 1500) => {
		if (timer) clearTimeout(timer)

		statusMessage = message
		timer = setTimeout(() => (statusMessage = ""), timeout)
	}

	const deleteCheckStandard = async () => {
		db.checkStandards.delete(checkStandard.id).then(() => {
			$checkStandards = $checkStandards?.filter((cs) => cs.id !== checkStandard.id) ?? []
		})
	}

	const updateName = async () => {
		db.checkStandards.update(checkStandard.id, { name }).then(() => {
			editing = false
			$checkStandards = [
				...($checkStandards ?? []).filter((cs) => cs.id !== checkStandard.id),
				{ ...checkStandard, name }
			].toSorted((a, b) => (a.name < b.name ? -1 : 1))
		})
	}

	function updateCheckValues() {
		db.checkStandards.update(checkStandard.id, checkStandard).then(() => {
			statusUpdate("Changes saved!")
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
					<h3>{checkStandard.name}</h3>
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
		<button on:click={deleteCheckStandard}>
			<IconTrash class="h-8 w-8 stroke-red-700 p-1" />
		</button>
	</div>

	<form on:submit|preventDefault={updateCheckValues}>
		<div class="grid grid-cols-6 gap-4 text-center">
			{#each ($elements ?? [])
				.filter((element) => $usedElementIDs.includes(element.id))
				.toSorted((a, b) => a.mass - b.mass) as element (element.id)}
				<div
					in:receive|local={{ key: element.id }}
					out:send|local={{ key: element.id }}
					animate:flip={{ duration: 200 }}
				>
					<CheckStandardElement {element} bind:value={checkStandard.values[element.id]} />
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
