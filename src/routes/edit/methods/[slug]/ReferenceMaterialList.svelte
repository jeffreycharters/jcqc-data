<script lang="ts">
	import EditIcon from "$lib/components/EditIcon.svelte"
	import type { ReferenceMaterialsResponse } from "$lib/pocketbase-types"
	import { methodElementsStore, methodStore } from "$lib/stores"
	import ReferenceMaterialElement from "./ReferenceMaterialElement.svelte"
	import type { ExpandedReferenceMaterial } from "$lib/types"
	import { pb } from "$lib/pocketbase"
	import { setReferenceMaterials } from "$lib/methods"
	import { fade } from "svelte/transition"
	import { createSwitch, melt } from "@melt-ui/svelte"
	// @ts-expect-error
	import IconTrash from "@tabler/icons-svelte/dist/svelte/icons/IconTrash.svelte"
	import { writable } from "svelte/store"

	export let referenceMaterial: ReferenceMaterialsResponse<ExpandedReferenceMaterial>
	let { name } = referenceMaterial

	const active = writable(referenceMaterial.active)

	const {
		elements: { root, input }
	} = createSwitch({ checked: active })

	active.subscribe((value) => {
		if (value === referenceMaterial.active) return

		pb.collection("referenceMaterials")
			.update(referenceMaterial.id, { active: value })
			.then(async () => await setReferenceMaterials($methodStore!.id))
	})

	let statusMessage = ""
	let editing = false

	let timer: NodeJS.Timeout
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
				<button type="button" on:click={() => (editing = !editing)} class:btn={editing}>
					{#if editing}
						Cancel
					{:else}
						<EditIcon classes="stroke-gray-400 h-5 w-5" strokeWidth="1.75" />
					{/if}
				</button>
				<div class="flex items-center gap-2">
					<button
						use:melt={$root}
						class="relative h-5 cursor-default rounded-full bg-stone-400 transition-colors data-[state=checked]:bg-green-600"
						id="airplane-mode"
						aria-labelledby="airplane-mode-label"
					>
						<span
							class="thumb block rounded-full transition {$active
								? 'bg-green-100'
								: 'bg-stone-100'}"
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
		{#each ($methodElementsStore ?? []).sort((a, b) => a.mass - b.mass) as methodElement (methodElement.id)}
			<ReferenceMaterialElement
				{referenceMaterial}
				{methodElement}
				on:updateStatus={statusUpdate}
			/>
		{/each}
	</div>
</div>

<style>
	button {
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
