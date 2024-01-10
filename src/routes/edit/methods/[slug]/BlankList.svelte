<script lang="ts">
	import EditIcon from "$lib/components/EditIcon.svelte"
	import type { BlanksResponse } from "$lib/pocketbase-types"
	import { methodElementsStore, methodStore } from "$lib/stores"
	import { IconTrash } from "@tabler/icons-svelte"
	import BlankElement from "./BlankElement.svelte"
	import { pb } from "$lib/pocketbase"
	import { setBlanks } from "$lib/methods"
	import type { ExpandedBlank } from "$lib/types"
	import { crossfade, fade } from "svelte/transition"
	import { flip } from "svelte/animate"

	export let blank: BlanksResponse<ExpandedBlank>

	const [send, receive] = crossfade({
		duration: 250
	})

	let statusMessage = ""

	let { name } = blank
	let editing = false

	let timer: number
	const statusUpdate = ({ detail }: CustomEvent<string>, timeout = 1500) => {
		if (timer) clearTimeout(timer)

		statusMessage = detail
		timer = setTimeout(() => (statusMessage = ""), timeout)
	}

	const deleteBlank = async () => {
		await pb.collection("blanks").delete(blank.id)
		await setBlanks($methodStore!.id)
	}

	const updateName = async () => {
		await pb.collection("blanks").update(blank.id, { name })
		await setBlanks($methodStore!.id)
		editing = false
	}
</script>

<div class="basic-border w-full h-full p-4 bg-white">
	<div class="flex justify-between items-center mb-4">
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
			{#if statusMessage}
				<div
					class="italic font-bold text-amber-700"
					in:fade={{ duration: 200 }}
					out:fade={{ duration: 500 }}
				>
					{statusMessage ?? ""}
				</div>
			{/if}
		</div>
		<button on:click={deleteBlank}>
			<IconTrash class="stroke-red-700 h-8 w-8 p-1" />
		</button>
	</div>

	<div class="grid grid-cols-6 gap-4 text-center">
		{#each ($methodElementsStore ?? []).sort( (a, b) => (a.mass < b.mass ? -1 : 1) ) as methodElement (methodElement.id)}
			<div
				in:receive|local={{ key: methodElement.id }}
				out:send|local={{ key: methodElement.id }}
				animate:flip={{ duration: 200 }}
			>
				<BlankElement {blank} element={methodElement} on:updateStatus={statusUpdate} />
			</div>
		{/each}
	</div>
</div>
