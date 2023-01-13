<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { createMethodElement, toggleMethodElementActive } from '$lib/methods';
	import { pb } from '$lib/pocketbase';
	import type { MethodReferenceMaterialsResponse, MethodsResponse } from '$lib/pocketbase-types';
	import { loqs, method, methods } from '$lib/stores';
	import ReferenceMaterial from './ReferenceMaterial.svelte';
	import type { PageData } from './$types';
	import LOQs from './LOQs.svelte';
	import MethodElement from './MethodElement.svelte';
	import { getMethodReferenceMaterialsByMethodId } from '$lib/referenceMaterials';

	export let data: PageData;

	let {
		usedElements,
		methodElements,
		loqList,
		unusedReferenceMaterials,
		methodReferenceMaterials
	} = data;

	let usedReferenceMaterials: MethodReferenceMaterialsResponse[] = (function () {
		const activeMaterials: MethodReferenceMaterialsResponse[] = methodReferenceMaterials.filter(
			(rm) => rm.active
		);
		return activeMaterials.map((rm) => rm?.expand?.referenceMaterial);
	})();

	$method = data.method;

	usedElements.forEach((e) => {
		const loq = loqList.find((loq) => loq.element === e.id);
		$loqs[e.id] = {
			value: loq?.value ?? undefined,
			existsInDb: !!loq
		};
	});

	if (!$method && browser) goto('/edit/methods', { invalidateAll: true, replaceState: true });

	let { name, description, calibrationCount, rpdLimit } = data.method || undefined;
	let formMessage = '';

	const addFormMessage = (message: string, timeout: number = 3000) => {
		formMessage = message;
		setTimeout(() => (formMessage = ''), timeout);
	};

	const editMethod = async () => {
		if (!name || !calibrationCount) {
			formMessage = 'Missing something';
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
			addFormMessage('Saved!');
		} catch (err) {
			const error = err as Error;
			addFormMessage(error.message);
		}
	};

	const toggleElementActive = async (element: MethodElement) => {
		const thisElement = methodElements.find((e) => e.id === element.id);
		if (!thisElement || !thisElement.id) {
			return;
		}
		if (thisElement.inDb) await toggleMethodElementActive(thisElement.id, !thisElement.active);
		else {
			const newMethodElement = await createMethodElement(thisElement.elementId, $method.id);
			thisElement.inDb = true;
			thisElement.id = newMethodElement.id;
		}
		if (thisElement) thisElement.active = !thisElement?.active;
		methodElements.sort((a, b) => (a.mass < b.mass ? -1 : 1));
		methodElements = methodElements.sort((a, b) => (a.active < b.active ? 1 : -1));
	};

	async function removeRM(referenceMaterialId: string) {
		const methodReferenceMaterial: MethodReferenceMaterialsResponse = await pb
			.collection('methodReferenceMaterials')
			.getFirstListItem(
				`method = "${$method.id}" && referenceMaterial = "${referenceMaterialId}"`,
				{
					expand: 'referenceMaterial'
				}
			);
		await pb
			.collection('methodReferenceMaterials')
			.update(methodReferenceMaterial.id, JSON.stringify({ active: false }));
		unusedReferenceMaterials = [
			...data.unusedReferenceMaterials,
			methodReferenceMaterial.expand?.referenceMaterial
		];
		methodReferenceMaterials = await getMethodReferenceMaterialsByMethodId($method.id);
	}
</script>

<h1>
	{$method.name}{#if $method.description}: {$method.description}{/if}
</h1>

<div class="flex items-start gap-8 max-w-screen-lg">
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
				<div>
					<input class="btn my-4" type="submit" value="Save Changes" />
				</div>
				{#if formMessage}
					<div class="text-sm text-green-600 lm-2">{formMessage}</div>
				{/if}
			</form>
		</div>
		<LOQs {usedElements} method={$method} />
	</div>

	<div class="mt-8">
		<div class="basic-border py-4 px-6">
			<h2 class="mb-4">Elements used by this method</h2>

			<div class="list-grid-container">
				{#each methodElements as element (element.id)}
					<MethodElement
						{element}
						on:toggleElement={(event) => toggleElementActive(event.detail)}
					/>
				{/each}
			</div>
		</div>

		<!-- TODO: Get reference material add/remove workgin. -->
		<div class="basic-border my-4 py-4 px-6">
			<h2>Reference Materials</h2>

			{#each usedReferenceMaterials as mrm (mrm.id)}
				<ReferenceMaterial {mrm} />
				<div>
					{mrm.id} <a href="/edit/methods/{$method.id}/{mrm.id}">Edit Limits</a>
					<button on:click={() => removeRM(mrm.id)}>Remove</button>
				</div>
			{/each}

			<h3>Available Materials</h3>
			<div>
				{#each data.unusedReferenceMaterials as rm (rm.id)}
					<div>
						{rm.name} <a href="/edit/methods/{$method.id}/{rm.id}">Use for this method</a>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
