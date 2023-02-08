<script lang="ts">
	import { method } from '$lib/stores';
	import { fade } from 'svelte/transition';

	$: elements = $method?.elements ?? [];
	$: lowElementCount = elements && elements?.length < 10;

	// TODO: add blanks, cal checks, rms. to the table.
</script>

{#if $method}
	<div class="w-fit mx-auto" in:fade|local={{ duration: 200 }}>
		<div
			class="flex {lowElementCount
				? 'flex-col gap-4'
				: 'justify-between gap-8'} items-end flex-wrap my-8"
		>
			<h2 class="text-2xl flex-grow border-b {lowElementCount ? 'self-start' : 'self-end'}">
				{$method.title}
			</h2>

			<div class="flex items-stretch gap-4">
				<div class="shadow py-2 px-4 flex flex-col items-center rouded bg-gray-50">
					<div class="text-xl font-bold text-gray-500">
						{#if $method.checkStandardTolerance}
							{$method.checkStandardTolerance}%
						{:else}
							- -
						{/if}
					</div>
					<div class="text-sm text-center text-gray-400 font-semibold">
						Check Standard Tolerance
					</div>
				</div>

				<div class="shadow py-2 px-4 flex flex-col items-center rouded bg-gray-50">
					<div class="text-xl font-bold text-gray-500">
						{#if $method.rpdLimit}
							{$method.rpdLimit}%
						{:else}
							- -
						{/if}
					</div>
					<div class="text-sm text-center text-gray-400 font-semibold">Duplicate RPD</div>
				</div>

				<div class="shadow py-2 px-4 flex flex-col items-center rouded bg-gray-50">
					<div class="text-xl font-bold text-gray-500">
						{#if $method.calibrationCount}
							{$method.calibrationCount}
						{:else}
							- -
						{/if}
					</div>
					<div class="text-sm text-center text-gray-400 font-semibold">Non-blank Standards</div>
				</div>

				<div class="shadow py-2 px-4 flex flex-col items-center rouded bg-gray-50">
					<div class="text-xl font-bold text-gray-500">
						{#if $method}
							3
						{:else}
							??
						{/if}
					</div>
					<div class="text-sm text-center text-gray-400 font-semibold">Sig figs on Report</div>
				</div>
			</div>
		</div>
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
						<td class="text-center">{element.mass}</td>
					{/each}
				</tr>
				<!--
				<tr class="bg-gray-200 border-b border-gray-400">
					<td class="first-column">Check STanadrds (fix)</td>
					{#each elements as element}
						<td class="text-center"> fix </td>
					{/each}
				</tr>

				{#each [] as rmName, index}
					{@const bgColour = index % 2 === 1 ? 'bg-gray-200' : ''}
					<tr class={bgColour}>
						{#each elements as element}
							<td class="text-center"> low </td>
						{/each}
					</tr>
					<tr class="border-b border-gray-400 {bgColour}">
						{#each elements as element}
							<td class="text-center"> range </td>
						{/each}
					</tr>
				{/each} -->
			</tbody>
		</table>
	</div>
{/if}

<style lang="postcss">
	td {
		@apply py-[6px] px-[10px];
	}
	td.first-column {
		@apply font-semibold text-gray-800 text-left;
	}
</style>
