<script lang="ts">
	import type { ElementsResponse } from '$lib/pocketbase-types';
	import type { PageData } from './$types';
	import AddElementForm from './AddElementForm.svelte';
	import Element from './Element.svelte';

	export let data: PageData;
	let { elementList } = data;

	$: activeElements = elementList.filter((element) => element.active);
	$: inactiveElements = elementList.filter((element) => !element.active);

	const toggleActive = (elementId: string, newState: boolean) => {
		const element = elementList.find((element) => element.id === elementId);
		if (!element) return;
		element.active = newState;
		elementList = elementList;
	};

	const addElement = (newElement: ElementsResponse) => {
		elementList.push(newElement);
		elementList.sort((a, b) => (a.mass < b.mass ? -1 : 1));
		elementList = elementList;
	};
</script>

<h1 class="my-4">Available Elements</h1>

<p class="my-4">
	Inactivating will remove the element <em>across all methods</em>. Maybe you just want to remove
	the element from <a href="/edit">one method</a>?
</p>

<div class="grid grid-cols-5 gap-4">
	{#each activeElements as element (element.id)}
		<Element
			{element}
			on:toggleActive={(event) => toggleActive(event.detail.id, event.detail.state)}
		/>
	{/each}

	{#each inactiveElements as element (element.id)}
		<Element
			{element}
			on:toggleActive={(event) => toggleActive(event.detail.id, event.detail.state)}
		/>
	{/each}
	<div class="col-span-3 row-span-2">
		<AddElementForm on:addElement={(event) => addElement(event.detail)} />
	</div>
</div>
