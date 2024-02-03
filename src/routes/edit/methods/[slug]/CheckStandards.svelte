<script lang="ts">
	import TextInput from "$lib/components/TextInput.svelte"
	import { fade, slide } from "svelte/transition"
	import CheckStandardList from "./CheckStandardCard.svelte"

	// @ts-expect-error
	import IconChevronsRight from "@tabler/icons-svelte/dist/svelte/icons/IconChevronsRight.svelte"
	// @ts-expect-error
	import IconPlus from "@tabler/icons-svelte/dist/svelte/icons/IconPlus.svelte"
	import { getCheckStandardsContext, getMethodContext } from "$lib/storage"
	import { db } from "$lib/db"
	import { createId } from "@paralleldrive/cuid2"
	import ActiveElement from "./ActiveElement.svelte"

	const method = getMethodContext()
	const checkStandards = getCheckStandardsContext()

	let newCalName = ""
	let calMessage = ""
	let open = false
	let addFormOpen = false

	async function createNewCheckStandard() {
		if (!newCalName) {
			calMessage = "Please add a name"
			return
		}

		const newCalCheck = {
			id: createId(),
			name: newCalName,
			method: $method!.slug,
			values: {}
		}

		db.checkStandards
			.add(newCalCheck)
			.then(async () => {
				$checkStandards = [...($checkStandards ?? []), newCalCheck]
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
		<button class="flex w-full items-center gap-2 px-8 py-4" on:click={() => (open = !open)}>
			<IconChevronsRight class="h-5 w-5 stroke-gray-400 transition-all {open ? 'rotate-90' : ''}" />
			<h2 class="inline-flex gap-4">Check Standard Targets</h2>
		</button>
		{#if calMessage}
			<div
				class="w-36 text-center text-sm italic tracking-wide text-amber-600"
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 100 }}
			>
				{calMessage}
			</div>
		{/if}
	</div>

	{#if open}
		<div class="mx-8 mb-8 flex flex-col gap-4" transition:slide={{ duration: 200 }}>
			{#each ($checkStandards ?? []).sort( (a, b) => (a.name > b.name ? 1 : -1) ) as checkStandard (checkStandard.name)}
				<div transition:slide={{ duration: 200 }}>
					<CheckStandardList {checkStandard} />
				</div>
			{:else}
				<div class="italic text-gray-400 text-sm font-bold ml-8">There aren't any!</div>
			{/each}

			<div class="basic-border w-fit bg-white px-4 py-2 transition-all">
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

						<div class="flex flex-col items-start gap-2">
							<div class="text-sm text-red-700">{calMessage ?? ""}</div>

							<button
								type="submit"
								class="btn w-full font-semibold"
								on:click|preventDefault={createNewCheckStandard}
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
