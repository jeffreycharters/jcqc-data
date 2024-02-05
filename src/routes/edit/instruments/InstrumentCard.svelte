<script lang="ts">
	import { db, type Instrument } from "$lib/db"
	import { crossfade } from "svelte/transition"

	// @ts-expect-error
	import IconEdit from "@tabler/icons-svelte/dist/svelte/icons/IconEdit.svelte"

	// @ts-expect-error
	import IconTrash from "@tabler/icons-svelte/dist/svelte/icons/IconTrash.svelte"
	import { getInstrumentsContext } from "$lib/storage"

	export let instrument: Instrument
	const instruments = getInstrumentsContext()

	let editing = false
	let statusMessage = ""

	const [send, receive] = crossfade({ duration: 200 })

	async function deleteInstrument() {
		await db.instruments.delete(instrument.id)
		$instruments = $instruments?.filter((i) => i.id !== instrument.id) ?? []
	}

	async function saveChanges() {
		await db.instruments.update(instrument.id, instrument)
		statusMessage = "Changes saved!"
		setTimeout(() => (statusMessage = ""), 1500)
		editing = false
	}
</script>

<div
	class="flex w-full flex-col rounded border border-stone-900 p-4 shadow"
	in:receive={{ key: instrument.id }}
	out:send={{ key: instrument.id }}
>
	{#if !editing}
		<div class="flex items-baseline justify-between">
			<h3 class="text-xl">{instrument.name}</h3>
			<div class="font-semibold italic text-stone-500">{instrument.serial}</div>
		</div>
		<hr class="pt-4" />

		<div>{instrument.autosamplerInfo}</div>
		<div>{instrument.softwareVersion}</div>

		<div class="mt-4 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<button
					class="btn flex items-center gap-2 !border-stone-500 text-sm hover:bg-stone-200"
					on:click={() => (editing = true)}
				>
					<IconEdit class="h-4 w-4" />
					Edit</button
				>
				{#if statusMessage}
					<div
						class="text-sm italic {statusMessage.includes('!')
							? 'font-semibold text-green-600'
							: 'text-red-600'}"
					>
						{statusMessage}
					</div>
				{/if}
			</div>

			<button class="rounded-full hover:bg-red-100" on:click={deleteInstrument}
				><IconTrash class="h-7 w-7 stroke-red-700 p-1" stroke="1.5" /></button
			>
		</div>
	{:else}
		<form on:submit|preventDefault={saveChanges}>
			<div class="flex items-baseline justify-between">
				<input
					class="rounded border border-b-0 border-stone-200 px-1 text-xl font-bold"
					bind:value={instrument.name}
					placeholder="Instrument Name"
				/>
				<input
					class="rounded border border-b-0 border-stone-200 px-1 text-right font-semibold italic text-stone-500"
					bind:value={instrument.serial}
					placeholder="Serial number"
				/>
			</div>
			<hr class="pt-4" />

			<div class="flex flex-col">
				<input
					type="text"
					bind:value={instrument.autosamplerInfo}
					class="rounded border border-stone-200 px-1"
					placeholder="Autosampler Info"
				/>
				<input
					type="text"
					bind:value={instrument.softwareVersion}
					class="rounded border border-t-0 border-stone-200 px-1"
					placeholder="Software Version"
				/>
			</div>

			<div class="mt-4 flex items-center gap-2">
				<button type="submit" class="flex-grow rounded bg-green-600 py-1 text-white"
					>Save changes</button
				>
				<button
					class="rounded bg-stone-200 px-4 py-1 text-stone-700"
					on:click={() => {
						statusMessage = "Possible unsaved changes."
						editing = false
					}}>Cancel</button
				>
			</div>
		</form>
	{/if}
</div>
