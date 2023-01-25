<script lang="ts">
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
				$loqs[storeIndex].value = loq.value ?? undefined;
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
{/if}
