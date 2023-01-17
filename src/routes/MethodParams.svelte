<script lang="ts">
	import { generateMethodParams } from '$lib/methodParams';
	import { referenceMaterials } from '$lib/stores';
	import { fade } from 'svelte/transition';

	export let methodId: string;

	let getMethodParams = generateMethodParams(methodId);
</script>

<div class="w-fit mx-auto" transition:fade|local={{ duration: 200 }}>
	{#await getMethodParams}
		<div />
	{:then methodParams}
		{@const elements = methodParams.elements}
		{@const loqs = methodParams.loqs}
		{@const referenceMaterials = methodParams.referenceMaterials}
		{@const referenceMaterialNames = methodParams.referenceMaterialNames}

		<table class="text-sm">
			<thead>
				<tr>
					<th class="w-36 text-sm font-semibold text-left">Elements</th>
					{#each elements as element}
						<th class="text-sm font-semibold px-2 text-center">
							<sup>{element.mass}</sup>{element.symbol}
						</th>
					{/each}
				</tr>
			</thead>

			<tbody>
				<tr class="bg-gray-100">
					<td>Units</td>
					{#each elements as element}
						<td class="text-center">
							{element.units}
						</td>
					{/each}
				</tr>
				<tr class="">
					<td>Method Blank LOQs</td>
					{#each elements as element}
						<td class="text-center">
							{loqs[element.symbol]}
						</td>
					{/each}
				</tr>
				<tr class="bg-gray-100">
					<td>Calibration Check</td>
					{#each elements as element}
						<td class="text-center">
							{element.checkStandard}
						</td>
					{/each}
				</tr>

				{#each referenceMaterialNames as rmName, index}
					<tr>
						<td>{rmName} Low</td>
						{#each elements as element}
							<td class="text-center">
								{referenceMaterials[rmName][element.symbol].low}
							</td>
						{/each}
					</tr>
					<tr class="bg-gray-100">
						<td>{rmName} High</td>
						{#each elements as element}
							<td class="text-center">
								{referenceMaterials[rmName][element.symbol].high}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	{/await}
</div>
