<script lang="ts">
	import type { ElementsResponse } from '$lib/pocketbase-types';
	import type { PageData } from './$types';
	import AddElementForm from './AddElementForm.svelte';
	import Element from './Element.svelte';

	export let data: PageData;
	let { elementList } = data;

	const toggleActive = (elementId: string, newState: boolean) => {
		const element = elementList.find((element) => element.id === elementId);
		if (!element) throw new Error("element not found");

		element.active = newState;
		elementList = [...elementList.filter(e => e.id != elementId), element];
	};

	const addElement = (newElement: ElementsResponse) => {
		elementList = [...elementList, newElement].toSorted((a, b) => (a.mass < b.mass ? -1 : 1))
	};
</script>

<h1 class="my-4">Available Elements</h1>

<div class="flex gap-2 my-4 border-orange-500 border py-2 px-4 rounded bg-orange-100 text-orange-600">
	<svg xmlns="http://www.w3.org/2000/svg" class="h6 w-6 stroke-orange-600" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
	<p>
		Inactivating will remove the element <em>across all methods</em>. Maybe you just want to remove
		the element from <a href="/edit" class="">one method</a>?
	</p>
</div>

<div class="grid grid-cols-5 gap-4">
	{#each elementList.filter((element) => element.active) as element (element.id)}
		<Element
			{element}
			on:toggleActive={(event) => toggleActive(event.detail.id, event.detail.state)}
		/>
	{/each}

	{#each elementList.filter((element) => !element.active) as element (element.id)}
		<Element
			{element}
			on:toggleActive={(event) => toggleActive(event.detail.id, event.detail.state)}
		/>
	{/each}
	<div class="col-span-3 row-span-2">
		<AddElementForm on:addElement={(event) => addElement(event.detail)} />
	</div>
</div>
