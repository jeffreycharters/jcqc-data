<script lang="ts">
	import { fade, slide } from "svelte/transition"
	import TextInput from "$lib/components/TextInput.svelte"
	import ReferenceMaterialCard from "./ReferenceMaterialCard.svelte"

	// @ts-expect-error
	import IconChevronsRight from "@tabler/icons-svelte/dist/svelte/icons/IconChevronsRight.svelte"
	// @ts-expect-error
	import IconPlus from "@tabler/icons-svelte/dist/svelte/icons/IconPlus.svelte"
	import { getMethodContext, getReferenceMaterialsContext } from "$lib/storage"
	import { derived } from "svelte/store"
	import { db } from "$lib/db"
	import { createId } from "@paralleldrive/cuid2"

	const referenceMaterials = getReferenceMaterialsContext()
	const method = getMethodContext()

	let newReferenceMaterialName = ""
	let formMessage: string
	let open = false
	let addFormOpen = false

	const sortedMaterials = derived(
		referenceMaterials,
		($referenceMaterialsStore) =>
			$referenceMaterialsStore
				?.toSorted((a, b) => (a.name < b.name ? 1 : -1))
				.toSorted((a, b) => (a.active && !b.active ? -1 : 1)) ?? []
	)

	async function createNewReferenceMaterial() {
		if (!newReferenceMaterialName) return (formMessage = "Please enter a name!")

		const newMaterial = {
			id: createId(),
			method: $method?.slug ?? "",
			name: newReferenceMaterialName,
			active: true,
			lower: {},
			upper: {}
		}

		db.referenceMaterials
			.add(newMaterial)
			.then(() => {
				$referenceMaterials = [...($referenceMaterials ?? []), newMaterial]
				newReferenceMaterialName = ""
				addFormOpen = false
			})
			.catch((err) => console.error(err))
	}
</script>

<div class="basic-border my-4 w-full bg-stone-100">
	<div class="flex items-end gap-4">
		<button class="flex w-full items-center gap-2 px-8 py-4" on:click={() => (open = !open)}>
			<IconChevronsRight class="h-5 w-5 stroke-gray-400 transition-all {open ? 'rotate-90' : ''}" />
			<h2 class="inline-flex gap-4">Reference Materials</h2>
		</button>
		{#if formMessage}
			<div
				class="w-36 text-center text-sm italic tracking-wide text-amber-600"
				in:fade={{ duration: 400 }}
				out:fade={{ duration: 500 }}
			>
				{formMessage}
			</div>
		{/if}
	</div>

	{#if open}
		<div class="mx-8 mb-8 flex flex-col gap-4" transition:slide={{ duration: 200 }}>
			{#each $sortedMaterials ?? [] as referenceMaterial (referenceMaterial.id)}
				<ReferenceMaterialCard {referenceMaterial} />
			{:else}
				<div class="italic text-gray-400 text-sm font-bold ml-8">There aren't any!</div>
			{/each}

			<div class="basic-border w-fit bg-white px-4 py-2 transition-all">
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

						<div class="flex flex-col items-start gap-2">
							<div class="text-sm text-red-500">{formMessage ?? ""}</div>
							<button
								type="submit"
								class="btn w-full font-semibold"
								on:click|preventDefault={createNewReferenceMaterial}
							>
								<div class="flex items-center justify-center py-[2px]">
									<IconPlus class="mr-1 h-4 w-4" />
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
