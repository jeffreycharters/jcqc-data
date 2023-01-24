<script lang="ts">
	import { generateMethodParams } from '$lib/methodParams';
	import { methodParams, selectedMethodId } from '$lib/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	// export let methodId: string;

	$: currentMethodParams = generateMethodParams($selectedMethodId);
</script>

<div class="w-fit mx-auto" in:fade|local={{ duration: 200 }}>
	{#await currentMethodParams}
		<div />
	{:then methodParams}
		{@const method = methodParams.method}

		<div class="flex items-end justify-between my-8 gap-8">
			<h2 class="text-2xl flex-grow border-b">
				{method.name}{#if method.description}: {method.description}{/if}
			</h2>

			<div class="flex items-stretch gap-4">
				<div class="shadow py-2 px-4 flex flex-col items-center rouded bg-gray-50">
					<div class="text-xl font-bold text-gray-500">
						{#if method.rpdLimit}
							{method.rpdLimit}%
						{:else}
							- -
						{/if}
					</div>
					<div class="text-sm text-center text-gray-400 font-semibold">Duplicate RPD</div>
				</div>

				<div class="shadow py-2 px-4 flex flex-col items-center rouded bg-gray-50">
					<div class="text-xl font-bold text-gray-500">
						{#if method.calibrationCount}
							{method.calibrationCount}
						{:else}
							- -
						{/if}
					</div>
					<div class="text-sm text-center text-gray-400 font-semibold">Non-blank Standards</div>
				</div>

				<div class="shadow py-2 px-4 flex flex-col items-center rouded bg-gray-50">
					<div class="text-xl font-bold text-gray-500">
						{#if method}
							3
						{:else}
							??
						{/if}
					</div>
					<div class="text-sm text-center text-gray-400 font-semibold">Sig figs on Report</div>
				</div>
			</div>
		</div>

		{@const elements = methodParams.elements}
		{@const loqs = methodParams.loqs}
		{@const referenceMaterials = methodParams.referenceMaterials}
		{@const referenceMaterialNames = methodParams.referenceMaterialNames}
		<table class="text-sm my-2 w-fit mx-auto">
			<thead>
				<tr class="border-b border-gray-400">
					<th class="max-w-xs text-sm first-column">Elements</th>
					{#each elements as element}
						<th class="text-sm font-semibold px-2 text-center">
							<sup>{element.mass}</sup>{element.symbol}
						</th>
					{/each}
				</tr>
			</thead>

			<tbody>
				<tr class="bg-gray-200 border-b border-gray-400">
					<td class="first-column">Units</td>
					{#each elements as element}
						<td class="text-center">
							{element.units}
						</td>
					{/each}
				</tr>
				<tr class="border-b border-gray-400">
					<td class="first-column">Method Blank LOQs</td>
					{#each elements as element}
						<td class="text-center">
							{loqs[element.mass] ?? '- -'}
						</td>
					{/each}
				</tr>
				<tr class="bg-gray-200 border-b border-gray-400">
					<td class="first-column">Calibration Check</td>
					{#each elements as element}
						<td class="text-center">
							{element.checkStandard ?? '- -'}
						</td>
					{/each}
				</tr>

				{#each referenceMaterialNames as rmName, index}
					{@const bgColour = index % 2 === 1 ? 'bg-gray-200' : ''}
					<tr class={bgColour}>
						<td rowspan="2" class="first-column">{rmName}</td>
						{#each elements as element}
							{@const thisElement = referenceMaterials.get(rmName)?.get(element.mass)}
							<td class="text-center">
								{thisElement?.low === 0 ? '- -' : thisElement?.low}
							</td>
						{/each}
					</tr>
					<tr class="border-b border-gray-400 {bgColour}">
						{#each elements as element}
							{@const thisElement = referenceMaterials.get(rmName)?.get(element.mass)}
							<td class="text-center">
								{thisElement?.high === 0 ? '- -' : thisElement?.high}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	{/await}
</div>

<style lang="postcss">
	td {
		@apply py-[6px] px-[10px];
	}
	td.first-column {
		@apply font-semibold text-gray-800 text-left;
	}
</style>
