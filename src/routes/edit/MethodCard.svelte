<script lang="ts">
	import { crossfade } from "svelte/transition"
	import { db, type Method } from "$lib/db"

	// @ts-expect-error
	import IconEdit from "@tabler/icons-svelte/dist/svelte/icons/IconEdit.svelte"
	import { getMethodsContext } from "$lib/storage"

	export let method: Method
	const { active } = method

	const methods = getMethodsContext()

	const [send, receive] = crossfade({ duration: 200 })

	const toggleMethodActive = async () => {
		await db.methods.update(method.slug, { active: !active })
		method = { ...method, active: !active }
		$methods = [...($methods?.filter((m) => m.slug !== method.slug) ?? []), method]
	}
</script>

<div
	class="flex w-full flex-col rounded border p-4 shadow {active
		? 'border-stone-900 text-stone-900'
		: 'border-stone-300 text-stone-500'}"
	in:receive={{ key: method.slug }}
	out:send={{ key: method.slug }}
>
	<h3 class="text-xl">{method.name}</h3>
	<div>{method.description}</div>

	<hr class="pt-4" />

	<div class="flex gap-2 text-sm">
		<button
			class:w-full={!active}
			class="rounded border border-dotted border-stone-400 px-2 py-1 text-stone-400"
			on:click={toggleMethodActive}
		>
			{active ? "Inactivate" : "Activate"}
		</button>

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
