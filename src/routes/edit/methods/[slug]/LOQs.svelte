<script lang="ts">
	import TextInput from "$lib/components/TextInput.svelte"
	import { blanksStore, methodStore } from "$lib/stores"
	import { fade, slide } from "svelte/transition"
	import BlankList from "./BlankList.svelte"
	import { pb } from "$lib/pocketbase"
	import { setBlanks } from "$lib/methods"
	// @ts-expect-error
	import IconChevronsRight from "@tabler/icons-svelte/dist/svelte/icons/IconChevronsRight.svelte"
	// @ts-expect-error
	import IconPlus from "@tabler/icons-svelte/dist/svelte/icons/IconPlus.svelte"

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
		<button class="flex w-full items-center gap-2 px-8 py-4" on:click={() => (open = !open)}>
			<IconChevronsRight class="h-5 w-5 stroke-gray-400 transition-all {open ? 'rotate-90' : ''}" />
			<h2 class="inline-flex gap-4">Blanks and Detection Limits</h2>
		</button>

		{#if blankMessage}
			<div
				class="w-36 text-center text-sm italic tracking-wide text-amber-600"
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 100 }}
			>
				{blankMessage}
			</div>
		{/if}
	</div>

	{#if open}
		<div class="mx-8 flex flex-col gap-4" transition:slide={{ duration: 200 }}>
			{#each $blanksStore ?? [] as blank (blank.id)}
				<BlankList {blank} />
			{/each}

			<div class="basic-border mb-8 w-fit bg-white px-4 py-2 transition-all">
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

						<div class="flex flex-col items-start gap-2">
							<div class="text-sm text-red-500">{blankMessage ?? ""}</div>
							<button
								type="submit"
								class="btn w-full font-semibold"
								on:click|preventDefault={createNewBlank}
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
