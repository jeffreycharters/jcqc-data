<script lang="ts">
	import { methodStore, referenceMaterialsStore } from "$lib/stores"
	import { fade, slide } from "svelte/transition"
	import TextInput from "$lib/components/TextInput.svelte"
	import ReferenceMaterialList from "./ReferenceMaterialList.svelte"
	import { IconChevronsRight, IconPlus } from "@tabler/icons-svelte"
	import { pb } from "$lib/pocketbase"
	import { setReferenceMaterials } from "$lib/methods"

	let newReferenceMaterialName = ""
	let formMessage: string
	let open = true
	let addFormOpen = false

	async function createNewReferenceMaterial() {
		await pb.collection("referenceMaterials").create({
			name: newReferenceMaterialName,
			method: $methodStore!.id,
			active: true
		})

		await setReferenceMaterials($methodStore!.id)
		newReferenceMaterialName = ""
		addFormOpen = false
	}
</script>

<div class="basic-border my-4 w-full bg-stone-100">
	<div class="flex items-end gap-4">
		<button class="flex gap-2 items-center px-8 py-4 w-full" on:click={() => (open = !open)}>
			<IconChevronsRight class="h-5 w-5 stroke-gray-400 transition-all {open ? 'rotate-90' : ''}" />
			<h2 class="inline-flex gap-4">Reference Materials</h2>
		</button>
		{#if formMessage}
			<div
				class="text-sm text-amber-600 italic tracking-wide w-36 text-center"
				in:fade={{ duration: 400 }}
				out:fade={{ duration: 500 }}
			>
				{formMessage}
			</div>
		{/if}
	</div>

	{#if open}
		<div class="flex flex-col gap-4 mx-8 mb-8" transition:slide={{ duration: 200 }}>
			{#each $referenceMaterialsStore ?? [] as referenceMaterial (referenceMaterial.id)}
				<ReferenceMaterialList {referenceMaterial} />
			{/each}

			<div class="basic-border py-2 px-4 w-fit transition-all bg-white">
				<button class="flex items-center gap-2" on:click={() => (addFormOpen = !addFormOpen)}>
					<IconChevronsRight
						class="h-5 w-5 stroke-gray-400 transition-all {addFormOpen ? 'rotate-90' : ''}"
					/>
					<h3>Add New Reference</h3>
				</button>

				{#if addFormOpen}
					<form class="w-48" transition:slide={{ duration: 200 }}>
						<TextInput
							label="Reference Material Name"
							placeholder="e.g. Bovine Liver"
							name="rm-name"
							bind:value={newReferenceMaterialName}
						/>

						<div class="flex flex-col gap-2 items-start">
							<div class="text-sm text-red-500">{formMessage ?? ""}</div>
							<button
								type="submit"
								class="btn font-semibold w-full"
								on:click|preventDefault={createNewReferenceMaterial}
							>
								<div class="flex items-center justify-center py-[2px]">
									<IconPlus class="h-4 w-4 mr-1" />
									Add
								</div>
							</button>
						</div>
					</form>
				{/if}
			</div>
		</div>
	{/if}
</div>
