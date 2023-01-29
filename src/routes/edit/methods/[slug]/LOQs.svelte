<script lang="ts">
	import TextInput from '$lib/components/TextInput.svelte';
	import { method } from '$lib/stores';
	import BlankList from './BlankList.svelte';

	let newBlankName = '';
	let blankMessage = '';

	const createNewBlank = async () => {
		if (!newBlankName) {
			blankMessage = 'Please add a blank name';
			return;
		}
		try {
			await $method.createNewBlank(newBlankName);
			$method = $method;
		} catch (err) {
			const error = err as Error;
			blankMessage = error.message;
			return;
		}

		newBlankName = '';
	};
</script>

<div class="basic-border py-4 px-8 mt-4">
	<h2>Blanks and Detection Limits/LOQs</h2>

	<div class="flex flex-col gap-4">
		{#if $method.blanks && $method.blanks?.size > 0}
			{#each Array.from($method.blanks).sort() as [_, blank] (blank.id)}
				<BlankList {blank} />
			{/each}
		{/if}

		<div class="basic-border p-4 w-fit">
			<h3>Add New Blank Type</h3>
			<form class="w-48">
				<TextInput
					label="Blank Name"
					placeholder="e.g. Method Blank"
					name="blank-name"
					bind:value={newBlankName}
				/>

				<div class="flex flex-col gap-2 items-start">
					<div class="text-sm text-red-500">{blankMessage ?? ''}</div>
					<input
						type="submit"
						value="+Add"
						class="btn font-semibold w-full"
						on:click|preventDefault={createNewBlank}
					/>
					// TODO: Make this collapsible
				</div>
			</form>
		</div>
	</div>
</div>

<!-- <script lang="ts">
	import { createElementLoq, updateElementLoq } from '$lib/methods';
	import { loqs, method } from '$lib/stores';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';

	let loqMessage = '';

	$: loqsToShow = $loqs.filter((loq) => loq.visible);

	const saveLoqs = async () => {
		loqsToShow.forEach(async (loq) => {
			if (loq.inDb && typeof loq.id === 'string') {
				await updateElementLoq(loq.id, loq.value ?? 0);
				const storeIndex = $loqs.findIndex((l) => l.id === loq.id);
				$loqs[storeIndex].value = loq.value;
			} else {
				const newLoq = await createElementLoq($method.id, loq.elementId, loq.value);
				const storeIndex = $loqs.findIndex((l) => l.id === loq.id);
				$loqs[storeIndex].id = newLoq.id;
				$loqs[storeIndex].inDb = true;
			}
		});
		loqMessage = 'Saved!';
		setTimeout(() => (loqMessage = ''), 1500);
	};
</script>

{#if loqsToShow.length > 0}
	<div
		class="basic-border py-4 px-8 mt-4 w-fit"
		in:fly|local={{ y: 50, duration: 150 }}
		out:fade|local={{ duration: 100 }}
	>
		<h2 class="my-2">Detection Limits</h2>
		<form on:submit|preventDefault={saveLoqs}>
			<div class="grid grid-cols-5 grid-flow-row gap-x-8 w-fit">
				{#each loqsToShow as element, index (`${element.id}-${element.mass}`)}
					<div
						class="max-w-[8rem] bg-gray-100 rounded my-1 p-1"
						transition:fade|local={{ duration: 150 }}
						animate:flip={{ duration: 150 }}
					>
						<div class="flex flex-col text-sm">
							<div class="flex  items-baseline justify-between mx-1">
								<label for="{element.symbol}-{element.mass}-loq}">
									<sup>{element.mass}</sup>{element.symbol}
								</label>
								<div class="text-xs text-gray-400 mr-2 font-bold">
									{element.units}
								</div>
							</div>
							<input
								type="text"
								class="number-input"
								bind:value={loqsToShow[index].value}
								name="{element.symbol}-{element.mass}-loq"
							/>
						</div>
					</div>
				{/each}
			</div>
			<div class="flex justify-between items-center mt-2">
				<div class="text-sm text-green-600">{loqMessage}</div>
				<button class="btn w-fit h-fit self-center justify-self-center">Save LOQs</button>
			</div>
		</form>
	</div>
{/if} -->
