<script lang="ts">
	import type { Instrument } from "$lib/db"
	import { crossfade } from "svelte/transition"

	// @ts-expect-error
	import IconEdit from "@tabler/icons-svelte/dist/svelte/icons/IconEdit.svelte"

	export let instrument: Instrument

	let editing = false
	// TODO: allow instrument editing

	const [send, receive] = crossfade({ duration: 200 })
</script>

<div
	class="flex w-full flex-col rounded border border-stone-900 p-4 shadow"
	in:receive={{ key: instrument.id }}
	out:send={{ key: instrument.id }}
>
	{#if !editing}
		<div class="flex items-center justify-between">
			<div>
				<h3 class="text-xl">{instrument.name}</h3>
				<div>{instrument.serial}</div>
			</div>
			<button class="btn flex items-center gap-2 !border-stone-500 text-sm hover:bg-stone-200">
				<IconEdit class="h-4 w-4" />
				Edit</button
			>
		</div>
		<hr class="pt-4" />

		<div>{instrument.autosamplerInfo}</div>
		<div>{instrument.softwareVersion}</div>
	{/if}
</div>
