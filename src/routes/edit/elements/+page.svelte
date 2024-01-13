<script lang="ts">
	import type { ElementsResponse } from "$lib/pocketbase-types"
	import { flip } from "svelte/animate"
	import type { PageData } from "./$types"
	import AddElementForm from "./AddElementForm.svelte"
	import Element from "./Element.svelte"
	import { crossfade } from "svelte/transition"
	import { quintOut } from "svelte/easing"
	import { IconExclamationCircle } from "@tabler/icons-svelte"

	const [send, receive] = crossfade({
		duration: 250,
		easing: quintOut
	})

	export let data: PageData
	let { elementList } = data

	function toggleActive({ detail }: CustomEvent<ElementsResponse>) {
		const element = elementList.find((element) => element.id === detail.id)
		if (!element) throw new Error("element not found")

		element.active = detail.active
		elementList = [...elementList.filter((e) => e.id != detail.id), element].sort((a, b) =>
			a.mass < b.mass ? -1 : 1
		)
	}

	function addElement({ detail }: CustomEvent<ElementsResponse>) {
		elementList = [...elementList, detail].sort((a, b) => (a.mass < b.mass ? -1 : 1))
	}
</script>

<h1 class="my-4">Available Elements</h1>

<div
	class="flex gap-4 my-4 border-orange-500 border py-4 px-8 rounded bg-orange-100 text-orange-600 w-fit items-center"
>
	<IconExclamationCircle />
	<p>
		Inactivating will remove the element <em>across all methods</em>.
		<br />
		Maybe you just want to remove the element from
		<a href="/edit" class="font-bold underline">one method</a>?
	</p>
</div>

<div class="grid grid-cols-5 gap-4 max-w-screen-lg">
	{#each elementList.filter((element) => element.active) as element (element.id)}
		<div
			animate:flip={{ duration: 250 }}
			in:send={{ key: element.id }}
			out:receive={{ key: element.id }}
		>
			<Element {element} on:toggleActive={toggleActive} />
		</div>
	{/each}

	{#each elementList.filter((element) => !element.active) as element (element.id)}
		<div
			animate:flip={{ duration: 250 }}
			in:send={{ key: element.id }}
			out:receive={{ key: element.id }}
		>
			<Element {element} on:toggleActive={toggleActive} />
		</div>
	{/each}
	<div class="col-span-3 row-span-2">
		<AddElementForm on:addElement={addElement} />
	</div>
</div>
