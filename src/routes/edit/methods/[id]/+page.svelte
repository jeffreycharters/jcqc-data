<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import type { ElementsResponse, MethodsResponse } from '$lib/pocketbase-types';
	import { methods } from '$lib/stores';
	import type { PageData } from './$types';

	export let data: PageData;
	let { method, usedElements, unusedElements, methodElements } = data;
	if (!method && browser) goto('/edit/methods', { invalidateAll: true, replaceState: true });

	let { name, rpdLimit } = data.method || undefined;
	let formMessage = '';

	const addFormMessage = (message: string, timeout: number = 3000) => {
		formMessage = message;
		setTimeout(() => (formMessage = ''), timeout);
	};

	const editMethod = async () => {
		if (!name) formMessage = 'Missing something';
		const updateData = JSON.stringify({
			name,
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
		await pb.collection('methodElements').create({
			method: method.id,
			element: element.id
		});
		usedElements = [...usedElements, element];
		usedElements.sort((a, b) => (a.mass < b.mass ? -1 : 1));
		unusedElements = unusedElements.filter((e) => e.id != element.id);
	}

	async function removeElement(element: ElementsResponse) {
		const methodElementToRemove = methodElements.find(
			(e) => e.element === element.id && e.method === method.id
		);
		if (!methodElementToRemove) return;
		await pb.collection('methodElements').delete(methodElementToRemove.id);
		unusedElements = [...unusedElements, element];
		unusedElements.sort((a, b) => (a.mass < b.mass ? -1 : 1));
		unusedElements = unusedElements;
		usedElements = usedElements.filter((e) => e.id != element.id);
	}
</script>

<h1>Editing Method: {method.name}</h1>

<form on:submit|preventDefault={editMethod}>
	<div>
		<label for="name">Method Name</label>
		<input type="text" name="name" placeholder="e.g. TOXI-064 or Serum Iodine" bind:value={name} />
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

{#each usedElements as element}
	<div>
		<sup>{element.mass}</sup>{element.symbol}
		{element.name}
		<button on:click={() => removeElement(element)}>Remove</button>
	</div>
{:else}
	NONE!
{/each}

<p>Available unused elements:</p>

{#each unusedElements as element}
	<div>
		<sup>{element.mass}</sup>{element.symbol}
		{element.name} <button on:click={() => addElement(element)}>Add</button>
	</div>
{:else}
	NONE!
{/each}
