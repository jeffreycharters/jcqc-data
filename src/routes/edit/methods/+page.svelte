<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import type { MethodsResponse } from '$lib/pocketbase-types';
	import { methods } from '$lib/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	methods.set(data.methodList);

	let name: string;
	let rpdLimit: number | undefined;
	let calibrationCount = 1;

	let formError: string;

	$: activeMethods = $methods.filter((e) => e.active);
	$: inactiveMethods = $methods.filter((e) => !e.active);

	const addMethod = async () => {
		if (!name || !calibrationCount) formError = 'Missing something';
		const methodData = JSON.stringify({
			name,
			calibrationCount,
			rpdLimit,
			active: true
		});
		try {
			const newMethod: MethodsResponse = await pb.collection('methods').create(methodData);
			methods.update((n) => {
				const newList = [...n, newMethod];
				newList.sort((a, b) => (a.name < b.name ? 1 : -1));
				name = '';
				rpdLimit = undefined;
				return newList;
			});
		} catch (err) {
			const error = err as Error;
			console.log(error);
		}
	};

	const toggleMethodActive = async (method: MethodsResponse) => {
		const methodData = {
			active: !method.active
		};
		const updatedMethod = await pb.collection('methods').update(method.id, methodData);

		methods.update((n) => {
			const selectedMethod = n.find((e) => e.id === updatedMethod.id);
			if (selectedMethod) {
				selectedMethod.active = updatedMethod.active;
			}
			return n;
		});
	};
</script>

<h1>Editing Available Methods</h1>

<h2>Add new</h2>

<form on:submit|preventDefault={addMethod}>
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
			min="1"
			max="225"
			bind:value={rpdLimit}
		/>
	</div>
	<input type="submit" value="Add Method" />
	{#if formError}
		<div style="color: #cc0000">{formError}</div>
	{/if}
</form>

<h2>Available Methods</h2>
{#each activeMethods as method (method.id)}
	<div>
		{method.name}
		<button on:click={() => toggleMethodActive(method)}
			>{method.active ? 'Inactivate' : 'Activate'}</button
		>
		<a href="/edit/methods/{method.id}">Edit this method</a>
	</div>
{:else}
	<div>NONE!</div>
{/each}

<h2>Inactive Methods</h2>
{#each inactiveMethods as method (method.id)}
	<div>
		{method.name}
		<button on:click={() => toggleMethodActive(method)}
			>{method.active ? 'Inactivate' : 'Activate'}</button
		>
	</div>
{:else}
	NONE!
{/each}
