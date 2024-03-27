<script lang="ts">
	import AddMethodForm from "./AddMethodForm.svelte"
	import MethodCard from "./MethodCard.svelte"
	import { flip } from "svelte/animate"
	import { quintOut } from "svelte/easing"
	import { crossfade } from "svelte/transition"

	// @ts-expect-error
	import IconPlaylistAdd from "@tabler/icons-svelte/dist/svelte/icons/IconPlaylistAdd.svelte"

	import type { PageData } from "./$types"
	import { setInstrumentsContext, setMethodsContext } from "$lib/storage"
	import DatabaseReminder from "./DatabaseReminder.svelte"

	export let data: PageData
	const { methods, instruments } = data

	const methodList = setMethodsContext(methods ?? [])
	setInstrumentsContext(instruments ?? [])

	const [send, receive] = crossfade({
		duration: 250,
		easing: quintOut
	})

	let showAddMethodForm = false
</script>

<div class="max-w-screen-lg flex justify-between my-2 items-end">
	<h1>Select method to edit</h1>
	<DatabaseReminder />
</div>


<div class="grid max-w-screen-lg grid-cols-3 gap-4">
	{#each ($methodList ?? []).filter((method) => method.active) as method (method.slug)}
		<div
			animate:flip={{ duration: 250 }}
			in:send={{ key: method.slug }}
			out:receive={{ key: method.slug }}
		>
			<MethodCard {method} />
		</div>
	{/each}
	{#each ($methodList ?? []).filter((method) => !method.active) as method (method.slug)}
		<div
			animate:flip={{ duration: 250 }}
			in:send={{ key: method.slug }}
			out:receive={{ key: method.slug }}
		>
			<MethodCard {method} />
		</div>
	{/each}

	<button
		on:click={() => (showAddMethodForm = !showAddMethodForm)}
		class="flex w-full items-center justify-center gap-2 rounded border border-gray-500 p-4 font-bold shadow-lg"
	>
		<IconPlaylistAdd class="h-8 w-8 stroke-[1.5]" />
		Add Method
	</button>
</div>

<AddMethodForm showAddForm={showAddMethodForm} on:close={() => (showAddMethodForm = false)} />
