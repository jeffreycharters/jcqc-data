<script lang="ts">
	import { method } from '$lib/stores';
	import type { PageData } from './$types';
	import LOQs from './LOQs.svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import ActiveElement from './ActiveElement.svelte';
	import InactiveElement from './InactiveElement.svelte';
	import type { Analyte } from '$lib/classes';
	import CheckStandards from './CheckStandards.svelte';
	import ReferenceMaterials from './ReferenceMaterials.svelte';
	import EditMethod from './EditMethod.svelte';

	export let data: PageData;
	let { elementList } = data;

	$: usedElements = $method.elements ?? [];
	$: unusedElements = elementList?.filter(
		(element) => !usedElements.map((e) => e.id).includes(element.id)
	);

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	const addElement = async (elementId: string) => {
		await $method.addElement(elementId);
		$method = $method;
	};

	const removeElement = async (element: Analyte) => {
		await $method.removeElement(element);
		$method = $method;
	};
</script>

<h1>{$method.title}</h1>

<EditMethod />

<div class="basic-border py-4 px-6">
	<div class="flex justify-between items-baseline">
		<h2 class="mb-4">
			Elements used by this method
			<span class="text-gray-400">[{usedElements?.length}]</span>
		</h2>
		<div class="text-gray-500">
			//TODO: add save indicators to this box || Changes in this box are saved as soon as they are
			made.
		</div>
	</div>

	<div class="grid grid-cols-8 gap-4">
		{#each usedElements.sort((a, b) => (a.mass < b.mass ? -1 : 1)) as element (element.id)}
			<div
				class="col-span-2"
				in:receive|local={{ key: element.id }}
				out:send|local={{ key: element.id }}
				animate:flip={{ duration: 150 }}
			>
				<ActiveElement {element} on:removeElement={(event) => removeElement(event.detail)} />
			</div>
		{/each}

		{#each unusedElements.sort((a, b) => (a.mass < b.mass ? -1 : 1)) as element (element.id)}
			<div
				in:receive|local={{ key: element.id }}
				out:send|local={{ key: element.id }}
				animate:flip={{ duration: 150 }}
			>
				<InactiveElement {element} on:addElement={(event) => addElement(event.detail)} />
			</div>
		{/each}
	</div>
</div>

<CheckStandards />

<LOQs />

<ReferenceMaterials />
