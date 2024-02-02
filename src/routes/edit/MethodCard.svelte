<script lang="ts">
	import { pb } from "$lib/pocketbase"
	import type { MethodsResponse } from "$lib/pocketbase-types"
	import { crossfade } from "svelte/transition"
	// @ts-expect-error
	import IconEdit from "@tabler/icons-svelte/dist/svelte/icons/IconEdit.svelte"
	// @ts-expect-error
	import IconFileArrowRight from "@tabler/icons-svelte/dist/svelte/icons/IconFileArrowRight.svelte"

	export let method: MethodsResponse

	const [send, receive] = crossfade({ duration: 200 })
	const { active } = method

	const toggleMethodActive = async () => {
		pb.collection("methods")
			.update(method.id, { active: !active })
			.then(async () => await setMethods())
	}
</script>

<div
	class="flex w-full flex-col rounded border p-4 shadow {active
		? 'border-stone-900 text-stone-900'
		: 'border-stone-300 text-stone-500'}"
	in:receive={{ key: method.id }}
	out:send={{ key: method.id }}
>
	<h3 class="text-xl">
		{method.name}
	</h3>

	<div class="">
		{method.description}
	</div>

	<hr class="pt-4" />

	<div class="flex gap-2 text-sm">
		<button
			class:w-full={!active}
			class="rounded border border-dotted border-stone-400 px-2 py-1 text-stone-400"
			on:click={toggleMethodActive}
		>
			{active ? "Inactivate" : "Activate"}
		</button>
		<button
			class="flex items-center justify-center gap-2 rounded border border-stone-400 bg-white px-3 py-1 text-center text-stone-500 no-underline hover:bg-stone-100"
			on:click={() => exportMethod(method.id)}
			><IconFileArrowRight class="h-4 w-4 stroke-stone-500" />
			Export</button
		>
		{#if active}
			<a
				href="/edit/methods/{method.slug}"
				class="flex flex-grow items-center justify-center gap-2 rounded border border-stone-500 bg-stone-50 py-1 text-center no-underline hover:bg-stone-200"
				><IconEdit class="h-4 w-4" />
				Edit</a
			>
		{/if}
	</div>
</div>
