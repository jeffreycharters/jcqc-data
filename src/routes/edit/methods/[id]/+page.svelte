<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { getOrCreateMethodElement, inactivateMethodElement } from '$lib/methods';
	import { pb } from '$lib/pocketbase';
	import type {
		ElementsResponse,
		MethodReferenceMaterialsResponse,
		MethodsResponse
	} from '$lib/pocketbase-types';
	import { addLoq, methods } from '$lib/stores';
	import type { PageData } from './$types';
	import LOQs from './LOQs.svelte';

	export let data: PageData;

	let { method, usedElements, unusedElements, methodElements, loqList } = data;

	usedElements.forEach((e) => {
		const loq = loqList.find((loq) => loq.element === e.id);
		addLoq(e.id, loq?.value ?? undefined, !!loq);
	});

	if (!method && browser) goto('/edit/methods', { invalidateAll: true, replaceState: true });

	let { name, rpdLimit, calibrationCount } = data.method || undefined;
	let formMessage = '';

	const addFormMessage = (message: string, timeout: number = 3000) => {
		formMessage = message;
		setTimeout(() => (formMessage = ''), timeout);
	};

	const editMethod = async () => {
		if (!name) formMessage = 'Missing something';
		const updateData = JSON.stringify({
			name,
			calibrationCount,
			rpdLimit: rpdLimit && rpdLimit > 0 ? rpdLimit : undefined
		});
		try {
			const newMethod: MethodsResponse = await pb
				.collection('methods')
				.update(method.id, updateData);
			methods.update((n) => {
				const newList = [...n, newMethod];
				newList.sort((a, b) => (a.name < b.name ? 1 : -1));
				return newList;
			});
			addFormMessage('Saved!');
		} catch (err) {
			const error = err as Error;
			addFormMessage(error.message);
		}
	};

	async function addElement(element: ElementsResponse) {
		const methodElement = await getOrCreateMethodElement(method.id, element.id);
		if (!methodElement) return;

		try {
			usedElements = [...usedElements, element];
			usedElements.sort((a, b) => (a.mass < b.mass ? -1 : 1));
			unusedElements = unusedElements.filter((e) => e.id != element.id);
		} catch (e) {
			console.log(element.id);
		}
	}

	async function removeElement(element: ElementsResponse) {
		const methodElementToRemove = methodElements.find((e) => e.element === element.id);
		if (!methodElementToRemove) return;

		await inactivateMethodElement(methodElementToRemove.id);
		unusedElements = [...unusedElements, element];
		unusedElements.sort((a, b) => (a.mass < b.mass ? -1 : 1));
		unusedElements = unusedElements;
		usedElements = usedElements.filter((e) => e.id != element.id);
	}

	async function removeRM(referenceMaterialId: string) {
		const methodReferenceMaterial: MethodReferenceMaterialsResponse = await pb
			.collection('methodReferenceMaterials')
			.getFirstListItem(`method = "${method.id}" && referenceMaterial = "${referenceMaterialId}"`, {
				expand: 'referenceMaterial'
			});
		await pb
			.collection('methodReferenceMaterials')
			.update(methodReferenceMaterial.id, JSON.stringify({ active: false }));
		data.unusedReferenceMaterials = [
			...data.unusedReferenceMaterials,
			methodReferenceMaterial.expand?.referenceMaterial
		];
		data.usedReferenceMaterials = data.usedReferenceMaterials.filter(
			(rm) => rm.id != methodReferenceMaterial.expand?.referenceMaterial.id
		);
	}
</script>

<h1>Editing Method: {method.name}</h1>

<form on:submit|preventDefault={editMethod}>
	<div>
		<label for="name">Method Name</label>
		<input type="text" name="name" placeholder="e.g. TOXI-064 or Serum Iodine" bind:value={name} />
	</div>
	<div>
		<label for="cal-count">Number of non-blank calibration standards:</label>
		<input
			type="number"
			name="cal-count"
			placeholder="e.g. 5"
			min="1"
			max="25"
			bind:value={calibrationCount}
		/>
	</div>
	<div>
		<label for="mass">RPD warning limit</label>
		<input
			type="number"
			name="mass"
			placeholder="e.g. 15"
			min="0"
			max="225"
			bind:value={rpdLimit}
		/>
	</div>
	<input type="submit" value="Save Changes" />
	{#if formMessage}
		<div style="color: #cc0000">{formMessage}</div>
	{/if}
</form>

<h2>Method Elements</h2>

<p>{method.name} is currently set up with the following elements.</p>

{#each usedElements as element (element.id)}
	<div>
		<sup>{element.mass}</sup>{element.symbol}
		{element.name}
		<button on:click={() => removeElement(element)}>Remove</button>
	</div>
{:else}
	NONE!
{/each}

<h3>Available unused elements:</h3>

{#each unusedElements as element (element.id)}
	<div>
		<sup>{element.mass}</sup>{element.symbol}
		{element.name} <button on:click={() => addElement(element)}>Add</button>
	</div>
{:else}
	NONE!
{/each}

<LOQs {usedElements} {method} />

<h2>Reference Materials</h2>

<h3>Active Materials</h3>
{#each data.usedReferenceMaterials as rm (rm.id)}
	<div>
		{rm.name} <a href="/edit/methods/{method.id}/{rm.id}">Edit Limits</a>
		<button on:click={() => removeRM(rm.id)}>Remove</button>
	</div>
{/each}

<h3>Available Materials</h3>
<div data-sveltekit-preload-data="off">
	{#each data.unusedReferenceMaterials as rm (rm.id)}
		<div>
			{rm.name} <a href="/edit/methods/{method.id}/{rm.id}">Use for this method</a>
		</div>
	{/each}
</div>
