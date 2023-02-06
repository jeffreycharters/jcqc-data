<script lang="ts">
	import type { Analyte } from '$lib/classes';
	import type { ElementsResponse } from '$lib/pocketbase-types';
	import { method } from '$lib/stores';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { crossfade, fade } from 'svelte/transition';
	import ActiveElement from './ActiveElement.svelte';
	import InactiveElement from './InactiveElement.svelte';

	export let elementList: ElementsResponse[];
	let contentDiv: HTMLDivElement;
	let formMessage = '';
	let open = false;

	$: usedElements = $method.elements ?? [];
	$: unusedElements = elementList?.filter(
		(element) => !usedElements.map((e) => e.id).includes(element.id)
	);

	const addElement = async (elementId: string) => {
		await $method.addElement(elementId);
		$method = $method;
		contentDiv.style.maxHeight = `${contentDiv.scrollHeight}px`;
	};

	const removeElement = async (element: Analyte) => {
		await $method.removeElement(element);
		$method = $method;
		contentDiv.style.maxHeight = `${contentDiv.scrollHeight}px`;
	};

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
</script>

<div class="basic-border my-4 px-8 py-4 w-full">
	<div class="flex items-end gap-4">
		<button class="flex gap-2 items-center" on:click={() => (open = !open)}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 stroke-gray-400 transition-all {open ? 'rotate-90' : ''}"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M7 7l5 5l-5 5" />
				<path d="M13 7l5 5l-5 5" />
			</svg>
			<h2 class="inline-flex whitespace-nowrap gap-4">
				Add/Remove elements
				<span class="text-gray-400 flex items-center font-semibold">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 stroke-gray-400"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M12 12v.01" />
						<path
							d="M19.071 4.929c-1.562 -1.562 -6 .337 -9.9 4.243c-3.905 3.905 -5.804 8.337 -4.242 9.9c1.562 1.561 6 -.338 9.9 -4.244c3.905 -3.905 5.804 -8.337 4.242 -9.9"
						/>
						<path
							d="M4.929 4.929c-1.562 1.562 .337 6 4.243 9.9c3.905 3.905 8.337 5.804 9.9 4.242c1.561 -1.562 -.338 -6 -4.244 -9.9c-3.905 -3.905 -8.337 -5.804 -9.9 -4.242"
						/>
					</svg>
					x{$method?.elements?.length ?? 'Unknown'}</span
				>
			</h2>
		</button>
		{#if formMessage}
			<div
				class="text-sm text-amber-600 italic tracking-wide w-36 text-center"
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 100 }}
			>
				{formMessage}
			</div>
		{/if}
	</div>

	<div
		class="overflow-hidden transition-all"
		style="max-height: {open ? `${contentDiv.scrollHeight}px` : '0'} "
		bind:this={contentDiv}
	>
		<div class="grid grid-cols-8 gap-4 mt-4">
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
</div>
