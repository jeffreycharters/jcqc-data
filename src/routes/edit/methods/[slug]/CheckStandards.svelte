<script lang="ts">
	import TextInput from "$lib/components/TextInput.svelte"
	import { checkStandardsStore, methodStore } from "$lib/stores"
	import { fade, slide } from "svelte/transition"
	import CheckStandardList from "./CheckStandardList.svelte"
	import { pb } from "$lib/pocketbase"
	import { IconChevronsRight, IconPlus } from "@tabler/icons-svelte"
	import { setCheckStandards } from "$lib/methods"

	let newCalName = ""
	let calMessage = ""
	let open = false
	let addFormOpen = false

	async function createNewCheckStandard() {
		if (!newCalName) {
			calMessage = "Please add a name"
			return
		}

		pb.collection("checkStandards")
			.create({
				name: newCalName,
				method: $methodStore!.id
			})
			.then(async () => {
				await setCheckStandards($methodStore!.id)
				newCalName = ""
				addFormOpen = false
			})
			.catch((err) => {
				calMessage = (err as Error).message
			})
	}
</script>

<div class="basic-border my-4 w-full bg-stone-100">
	<div class="flex items-end gap-4">
		<button class="flex gap-2 items-center px-8 py-4 w-full" on:click={() => (open = !open)}>
			<IconChevronsRight class="h-5 w-5 stroke-gray-400 transition-all {open ? 'rotate-90' : ''}" />
			<h2 class="inline-flex gap-4">Check Standard Targets</h2>
		</button>
		{#if calMessage}
			<div
				class="text-sm text-amber-600 italic tracking-wide w-36 text-center"
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 100 }}
			>
				{calMessage}
			</div>
		{/if}
	</div>

	{#if open}
		<div class="flex flex-col gap-4 mb-8 mx-8" transition:slide={{ duration: 200 }}>
			{#each ($checkStandardsStore ?? []).sort( (a, b) => (a.name > b.name ? 1 : -1) ) as checkStandard (checkStandard.id)}
				<CheckStandardList {checkStandard} />
			{/each}

			<div class="basic-border py-2 px-4 w-fit transition-all bg-white">
				<button class="flex items-center gap-2" on:click={() => (addFormOpen = !addFormOpen)}>
					<IconChevronsRight
						class="h-5 w-5 stroke-gray-400 transition-all {addFormOpen ? 'rotate-90' : ''}"
					/>
					<h3>Add New Check Standard</h3>
				</button>

				{#if addFormOpen}
					<form class="w-48" transition:slide={{ duration: 200 }}>
						<TextInput
							label="Check Standard Name"
							placeholder="e.g. Calibration Check"
							name="cal-name"
							bind:value={newCalName}
						/>

						<div class="flex flex-col gap-2 items-start">
							<div class="text-sm text-red-700">{calMessage ?? ""}</div>

							<button
								type="submit"
								class="btn font-semibold w-full"
								on:click|preventDefault={createNewCheckStandard}
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
