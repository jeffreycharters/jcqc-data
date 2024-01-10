<script lang="ts">
	import TextInput from "$lib/components/TextInput.svelte"
	import { blanksStore, methodStore } from "$lib/stores"
	import { fade, slide } from "svelte/transition"
	import BlankList from "./BlankList.svelte"
	import { pb } from "$lib/pocketbase"
	import { setBlanks } from "$lib/methods"
	import { IconChevronsRight, IconPlus } from "@tabler/icons-svelte"

	let newBlankName = ""
	let blankMessage = ""
	let open = false
	let addFormOpen = false

	const createNewBlank = async () => {
		if (!newBlankName) {
			blankMessage = "Please add a blank name"
			return
		}

		await pb.collection("blanks").create({
			name: newBlankName,
			method: $methodStore!.id
		})
		await setBlanks($methodStore!.id)
		newBlankName = ""
		addFormOpen = false
	}
</script>

<div class="basic-border my-4 w-full bg-stone-100">
	<div class="flex items-end gap-4">
		<button class="flex gap-2 items-center px-8 py-4 w-full" on:click={() => (open = !open)}>
			<IconChevronsRight class="h-5 w-5 stroke-gray-400 transition-all {open ? 'rotate-90' : ''}" />
			<h2 class="inline-flex gap-4">Blanks and Detection Limits</h2>
		</button>

		{#if blankMessage}
			<div
				class="text-sm text-amber-600 italic tracking-wide w-36 text-center"
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 100 }}
			>
				{blankMessage}
			</div>
		{/if}
	</div>

	{#if open}
		<div class="flex flex-col gap-4 mx-8" transition:slide={{ duration: 200 }}>
			{#each $blanksStore ?? [] as blank (blank.id)}
				<BlankList {blank} />
			{/each}

			<div class="basic-border py-2 px-4 w-fit transition-all bg-white mb-8">
				<button class="flex items-center gap-2" on:click={() => (addFormOpen = !addFormOpen)}>
					<IconChevronsRight
						class="h-5 w-5 stroke-gray-400 transition-all {addFormOpen ? 'rotate-90' : ''}"
					/>
					<h3>Add New Blank Type</h3>
				</button>

				{#if addFormOpen}
					<form class="w-48" transition:slide={{ duration: 200 }}>
						<TextInput
							label="Blank Name"
							placeholder="e.g. Method Blank"
							name="blank-name"
							bind:value={newBlankName}
						/>

						<div class="flex flex-col gap-2 items-start">
							<div class="text-sm text-red-500">{blankMessage ?? ""}</div>
							<button
								type="submit"
								class="btn font-semibold w-full"
								on:click|preventDefault={createNewBlank}
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
