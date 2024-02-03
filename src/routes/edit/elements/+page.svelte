<script lang="ts">
	import { flip } from "svelte/animate"
	import AddElementForm from "./AddElementForm.svelte"
	import { crossfade } from "svelte/transition"
	import { quintOut } from "svelte/easing"

	// @ts-expect-error
	import IconExclamationCircle from "@tabler/icons-svelte/dist/svelte/icons/IconExclamationCircle.svelte"
	import type { PageData } from "./$types"
	import { setEditableElementsContext, setElementsContext } from "$lib/storage"
	import ElementComponent from "./Element.svelte"

	export let data: PageData
	const { elementList, editableList } = data

	setEditableElementsContext(editableList ?? [])
	const elements = setElementsContext(elementList ?? [])

	const [send, receive] = crossfade({
		duration: 250,
		easing: quintOut
	})
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
	{#each ($elements ?? []).filter((element) => element.active) as element (element.id)}
		<div
			animate:flip={{ duration: 250 }}
			in:send={{ key: element.id }}
			out:receive={{ key: element.id }}
		>
			<ElementComponent {element} />
		</div>
	{/each}

	{#each ($elements ?? []).filter((element) => !element.active) as element (element.id)}
		<div
			animate:flip={{ duration: 250 }}
			in:send={{ key: element.id }}
			out:receive={{ key: element.id }}
		>
			<ElementComponent {element} />
		</div>
	{/each}
	<div class="col-span-3 row-span-2">
		<AddElementForm />
	</div>
</div>
