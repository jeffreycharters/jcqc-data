<script lang="ts">
	import EditIcon from "$lib/components/EditIcon.svelte"
	import type { CheckStandardsResponse, ElementsResponse } from "$lib/pocketbase-types"
	import { checkStandardsStore, methodElementsStore, methodStore } from "$lib/stores"
	import { crossfade } from "svelte/transition"
	import CheckStandardElement from "./CheckStandardElement.svelte"
	import { flip } from "svelte/animate"
	import type { ExpandedCheckStandard } from "$lib/types"
	import { pb } from "$lib/pocketbase"
	import { setCheckStandards } from "$lib/methods"
	import { fade } from "svelte/transition"
	// @ts-expect-error
	import IconTrash from "@tabler/icons-svelte/dist/svelte/icons/IconTrash.svelte"

	export let checkStandard: CheckStandardsResponse<ExpandedCheckStandard>
	let { name } = checkStandard

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
		await pb.collection("checkStandards").delete(checkStandard.id)
		await setCheckStandards($methodStore!.id)
	}

	const updateName = async () => {
		await pb.collection("checkStandards").update(checkStandard.id, { name: name })
		await setCheckStandards($methodStore!.id)
		editing = false
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

			{#if statusMessage}
				<div
					class="font-bold italic text-amber-700"
					in:fade={{ duration: 200 }}
					out:fade={{ duration: 500 }}
				>
					{statusMessage ?? ""}
				</div>
			{/if}
		</div>
		<button on:click={deleteCheckStandard}>
			<IconTrash class="h-8 w-8 stroke-red-700 p-1" />
		</button>
	</div>

	<div class="grid grid-cols-6 gap-4 text-center">
		{#each ($methodElementsStore ?? []).sort( (a, b) => (a.mass < b.mass ? -1 : 1) ) as methodElement (methodElement.id)}
			<div
				in:receive|local={{ key: methodElement.id }}
				out:send|local={{ key: methodElement.id }}
				animate:flip={{ duration: 200 }}
			>
				<CheckStandardElement
					{checkStandard}
					element={methodElement}
					on:updateStatus={(event) => statusUpdate(event.detail)}
				/>
			</div>
		{/each}
	</div>
</div>
