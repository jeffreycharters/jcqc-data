<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { pb } from '$lib/pocketbase';
	import type { ElementsResponse, MethodsResponse } from '$lib/pocketbase-types';
	import { method } from '$lib/stores';
	import ReferenceMaterial from './ReferenceMaterial.svelte';
	import type { PageData } from './$types';
	import LOQs from './LOQs.svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import ActiveElement from './ActiveElement.svelte';
	import InactiveElement from './InactiveElement.svelte';
	import type { Analyte } from '$lib/classes';
	import CheckStandards from './CheckStandards.svelte';

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

	let formMessage = '';

	const addFormMessage = (message: string, timeout: number = 3000) => {
		formMessage = message;
		setTimeout(() => (formMessage = ''), timeout);
	};

	const editMethod = async () => {
		if (!$method.name || !$method.calibrationCount) {
			addFormMessage('Missing something');
			return;
		}
		try {
			$method.updateProperties({
				name: $method.name,
				calibrationCount: $method.calibrationCount,
				description: $method.description,
				checkStandardTolerance: $method.checkStandardTolerance,
				checkStandardName: $method.checkStandardName,
				rpdLimit: $method.rpdLimit
			});
			addFormMessage('Saved');
		} catch (err) {
			const error = err as Error;
			addFormMessage(error.message);
		}
	};

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

<div>
	<div class="basic-border mt-8 px-8 py-4 w-fit">
		<h2>Edit Method</h2>
		<form on:submit|preventDefault={editMethod}>
			<div class="grid grid-cols-2 gap-x-12">
				<TextInput
					name="name"
					placeholder="e.g. TOXI-064 or Serum Iodine"
					bind:value={$method.name}
					label="Method Name"
				/>
				<TextInput
					name="description"
					placeholder="e.g. Metals in serum"
					bind:value={$method.description}
					label="Method Description"
				/>
				<NumberInput
					name="cal-count"
					label="Number of non-blank calibration standards"
					bind:value={$method.calibrationCount}
					placeholder="e.g. 6"
				/>
				<NumberInput
					name="rpd-limit"
					label="RPD Warning limit (%)"
					bind:value={$method.rpdLimit}
					placeholder="e.g. 15"
				/>
				<TextInput
					name="check-standard-name"
					label="Check Standard Name"
					bind:value={$method.checkStandardName}
					placeholder="e.g. Calibration Check"
				/>
				<NumberInput
					name="check-standard-limit"
					label="Check Standard Tolerance (%)"
					bind:value={$method.checkStandardTolerance}
					placeholder="e.g. 15"
				/>
				<div>
					{#if formMessage}
						<div class="text-sm lm-2" in:fade={{ duration: 200 }} out:fade={{ duration: 100 }}>
							{formMessage}
						</div>
					{/if}
				</div>
				<div class="justify-end">
					<input class="btn my-4" type="submit" value="Save Changes" />
				</div>
			</div>
		</form>
	</div>
</div>

<div class="mt-8 w-full">
	<div class="basic-border py-4 px-6">
		<div class="flex justify-between items-baseline">
			<h2 class="mb-4">
				Elements used by this method
				<span class="text-gray-400">[{usedElements?.length}]</span>
			</h2>
			<div class="text-gray-500">Changes in this box are saved as soon as they are made.</div>
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

	<!--
	<div class="basic-border my-4 py-4 px-6 w-full max-w-screen-xl">
		<h2 class="mb-4">Reference Materials</h2>

		<div class="grid grid-cols-3 gap-4">
			{#each $methodReferenceMaterials.filter((rm) => rm.active) as rm (rm.id)}
				<ReferenceMaterial {rm} />
			{/each}

			{#each $methodReferenceMaterials.filter((rm) => !rm.active) as rm (rm.id)}
				<ReferenceMaterial {rm} />
			{/each}
		</div>
	</div>
-->
</div>
