<script lang="ts">
	import EditIcon from "$lib/components/EditIcon.svelte"
	import type { ReferenceMaterialsResponse } from "$lib/pocketbase-types"
	import { methodElementsStore, methodStore } from "$lib/stores"
	import ReferenceMaterialElement from "./ReferenceMaterialElement.svelte"
	import type { ExpandedReferenceMaterial } from "$lib/types"
	import { pb } from "$lib/pocketbase"
	import { setReferenceMaterials } from "$lib/methods"
	import { fade } from "svelte/transition"
	// @ts-expect-error
	import IconTrash from "@tabler/icons-svelte/dist/svelte/icons/IconTrash.svelte"

	export let referenceMaterial: ReferenceMaterialsResponse<ExpandedReferenceMaterial>
	let { name } = referenceMaterial

	let statusMessage = ""
	let editing = false

	let timer: number
	const statusUpdate = ({ detail }: CustomEvent<string>, timeout = 1500) => {
		if (timer) clearTimeout(timer)

		statusMessage = detail
		timer = setTimeout(() => (statusMessage = ""), timeout)
	}

	const deleteCheckStandard = async () => {
		await pb.collection("referenceMaterials").delete(referenceMaterial.id)
		await setReferenceMaterials($methodStore!.id)
	}

	const updateName = async () => {
		await pb.collection("referenceMaterials").update(referenceMaterial.id, { name })
		await setReferenceMaterials($methodStore!.id)
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
					<h3>{name}</h3>
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
					class="font-bold italic text-amber-600"
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
			<ReferenceMaterialElement
				{referenceMaterial}
				{methodElement}
				on:updateStatus={statusUpdate}
			/>
		{/each}
	</div>
</div>
