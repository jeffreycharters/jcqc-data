<script lang="ts">
	import type { ElementsResponse } from "$lib/pocketbase-types"
	import { flip } from "svelte/animate"
	import AddElementForm from "./AddElementForm.svelte"
	import Element from "./Element.svelte"
	import { crossfade } from "svelte/transition"
	import { quintOut } from "svelte/easing"

	// @ts-expect-error
	import IconExclamationCircle from "@tabler/icons-svelte/dist/svelte/icons/IconExclamationCircle.svelte"

	const [send, receive] = crossfade({
		duration: 250,
		easing: quintOut
	})

	export let data
	let { elementList, editableList } = data

	function toggleActive({ detail }: CustomEvent<ElementsResponse>) {
		const element = elementList.find((element) => element.id === detail.id)
		if (!element) throw new Error("element not found")

		element.active = detail.active
		elementList = [...elementList.filter((e) => e.id != detail.id), element].sort(
			(a, b) => a.mass - b.mass
		)
	}

	function addElement({ detail }: CustomEvent<ElementsResponse>) {
		elementList = [...elementList, detail].sort((a, b) => a.mass - b.mass)
		editableList = [...editableList, detail.id]
	}
</script>

<h1 class="my-4">Available Elements</h1>

<div
	class="my-4 flex w-fit items-center gap-4 rounded border border-orange-500 bg-orange-100 px-8 py-4 text-orange-600"
>
	<IconExclamationCircle />
	<p>
		Inactivating will remove the element <em>across all methods</em>.
		<br />
		Maybe you just want to remove the element from
		<a href="/edit" class="font-bold underline">one method</a>?
	</p>
</div>

<div class="grid max-w-screen-lg grid-cols-4 gap-4">
	{#each elementList.filter((element) => element.active) as element (element.id)}
		<div
			animate:flip={{ duration: 250 }}
			in:send={{ key: element.id }}
			out:receive={{ key: element.id }}
		>
			<Element
				{element}
				on:toggleActive={toggleActive}
				editable={editableList.includes(element.id)}
			/>
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
