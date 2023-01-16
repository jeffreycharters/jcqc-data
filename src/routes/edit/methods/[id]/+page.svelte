<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { pb } from '$lib/pocketbase';
	import type { MethodsResponse } from '$lib/pocketbase-types';
	import { loqs, method, methodReferenceMaterials, methods } from '$lib/stores';
	import ReferenceMaterial from './ReferenceMaterial.svelte';
	import type { PageData } from './$types';
	import LOQs from './LOQs.svelte';
	import MethodElement from './MethodElement.svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let data: PageData;

	let { methodElements } = data;

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
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

	$loqs = data.loqArray;
	$method = data.method;
	$methodReferenceMaterials = data.methodReferenceMaterialsList;
	if (!$method && browser) goto('/edit/methods', { invalidateAll: true, replaceState: true });

	let { name, description, calibrationCount, rpdLimit } = data.method || undefined;

	const addFormMessage = (message: string, timeout: number = 3000) => {
		formMessage = message;
		setTimeout(() => (formMessage = ''), timeout);
	};

	const editMethod = async () => {
		if (!name || !calibrationCount) {
			addFormMessage('Missing something');
			return;
		}
		const updateData = JSON.stringify({
			name,
			calibrationCount,
			description,
			rpdLimit: rpdLimit ?? 0
		});
		try {
			const newMethod: MethodsResponse = await pb
				.collection('methods')
				.update($method.id, updateData);
			methods.update((n) => {
				const newList = [...n, newMethod];
				newList.sort((a, b) => (a.name < b.name ? 1 : -1));
				return newList;
			});
			$method = newMethod;
			addFormMessage('Saved');
		} catch (err) {
			const error = err as Error;
			addFormMessage(error.message);
		}
	};

	const getLoqIndexByElementId = (elementId: string) => {
		return $loqs.findIndex((loq) => loq.elementId === elementId && loq.methodId === $method.id);
	};

	const toggleElementActive = async (element: MethodElement) => {
		const thisElement = methodElements.find((e) => e.id === element.id);
		if (!thisElement || !thisElement.id) {
			return;
		}

		const loqIndex = getLoqIndexByElementId(thisElement.elementId);
		$loqs[loqIndex].visible = thisElement.active;
		methodElements.sort((a, b) => (a.mass < b.mass ? -1 : 1));
		methodElements = methodElements.sort((a, b) => (a.active < b.active ? 1 : -1));
	};
</script>

<h1>
	{$method.name}{#if $method.description}: {$method.description}{/if}
</h1>

<div class="flex items-start gap-8 max-w-screen-xl">
	<div>
		<div class="basic-border mt-8 px-8 py-4 w-fit">
			<h2>Edit Method</h2>
			<form on:submit|preventDefault={editMethod}>
				<TextInput
					name="name"
					placeholder="e.g. TOXI-064 or Serum Iodine"
					bind:value={name}
					label="Method Name"
				/>
				<TextInput
					name="description"
					placeholder="e.g. Metals in serum"
					bind:value={description}
					label="Method Name"
				/>
				<NumberInput
					name="cal-count"
					label="Number of non-blank calibration standards"
					bind:value={calibrationCount}
					placeholder="e.g. 6"
				/>
				<NumberInput
					name="rpd-limit"
					label="RPD Warning limit"
					bind:value={rpdLimit}
					placeholder="e.g. 15"
				/>
				<div class="flex items-baseline justify-between">
					<div>
						{#if formMessage}
							<div class="text-sm lm-2" in:fade={{ duration: 200 }} out:fade={{ duration: 100 }}>
								{formMessage}
							</div>
						{/if}
					</div>
					<div>
						<input class="btn my-4" type="submit" value="Save Changes" />
					</div>
				</div>
			</form>
		</div>
		<LOQs />
	</div>

	<div class="mt-8 w-full">
		<div class="basic-border py-4 px-6">
			<div class="flex justify-between">
				<h2 class="mb-4">Elements used by this method</h2>
				<div class="text-gray-500">Changes in this box are saved as soon as they are made.</div>
			</div>

			<div class="grid grid-cols-6 gap-4">
				{#each methodElements.filter((me) => me.active) as element (element.id)}
					<div
						class={element.active ? 'col-span-2' : ''}
						in:receive|local={{ key: element.id }}
						out:send|local={{ key: element.id }}
						animate:flip={{ duration: 150 }}
					>
						<MethodElement
							{element}
							on:toggleElement={(event) => toggleElementActive(event.detail)}
						/>
					</div>
				{/each}
				{#each methodElements.filter((me) => !me.active) as element (element.id)}
					<div
						in:receive|local={{ key: element.id }}
						out:send|local={{ key: element.id }}
						animate:flip={{ duration: 150 }}
					>
						<MethodElement
							{element}
							on:toggleElement={(event) => toggleElementActive(event.detail)}
						/>
					</div>
				{/each}
			</div>
		</div>

		<div class="basic-border my-4 py-4 px-6 w-full max-w-screen-xl">
			<h2 class="mb-4">Reference Materials</h2>

			<div class="grid grid-cols-2 gap-4">
				{#each $methodReferenceMaterials.filter((rm) => rm.active) as rm (rm.id)}
					<ReferenceMaterial {rm} />
				{/each}

				{#each $methodReferenceMaterials.filter((rm) => !rm.active) as rm (rm.id)}
					<ReferenceMaterial {rm} />
				{/each}
			</div>
		</div>
	</div>
</div>
