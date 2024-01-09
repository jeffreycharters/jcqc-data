<script lang="ts">
	import { methodStore } from "$lib/stores"
	import ReferenceMaterial from "../report/ReferenceMaterial.svelte"

	$: elements = $methodStore?.elements?.sort((a, b) => (a.mass < b.mass ? -1 : 1)) ?? []
	$: lowElementCount = elements && elements?.length < 15

	$: methodHasCheckStandards = $methodStore?.checkStandards && $methodStore?.checkStandards.size > 0
	$: methodHasBlanks = $methodStore?.blanks && $methodStore?.blanks.size > 0
	$: methodHasReferenceMaterials =
		$methodStore?.referenceMaterials && $methodStore?.referenceMaterials.size > 0
</script>

{#if $methodStore}
	<div class="w-fit mx-auto">
		<div
			class="flex {lowElementCount
				? 'flex-col gap-4'
				: 'justify-between gap-8'} items-end flex-wrap my-8"
		>
			<h2 class="text-2xl flex-grow border-b {lowElementCount ? 'self-start' : 'self-end'}">
				{$methodStore.name}: {$methodStore.description}
			</h2>

			<div class="flex items-stretch gap-4">
				<div class="shadow py-2 px-4 flex flex-col items-center rouded bg-gray-50">
					<div class="text-xl font-bold text-gray-500">
						{#if $methodStore.checkStandardTolerance}
							{$methodStore.checkStandardTolerance}%
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
						{#if $methodStore.rpdLimit}
							{$methodStore.rpdLimit}%
						{:else}
							- -
						{/if}
					</div>
					<div class="text-sm text-center text-gray-400 font-semibold">Duplicate RPD</div>
				</div>

				<div class="shadow py-2 px-4 flex flex-col items-center rouded bg-gray-50">
					<div class="text-xl font-bold text-gray-500">
						{#if $methodStore.calibrationCount}
							{$methodStore.calibrationCount}
						{:else}
							- -
						{/if}
					</div>
					<div class="text-sm text-center text-gray-400 font-semibold">Non-blank Standards</div>
				</div>

				<div class="shadow py-2 px-4 flex flex-col items-center rouded bg-gray-50">
					<div class="text-xl font-bold text-gray-500">
						{#if $methodStore}
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
				{#if elements.length > 0}
					<tr>
						<td class="first-column">Units</td>
						{#each elements as element}
							<td class="text-center">{element.units}</td>
						{/each}
					</tr>
				{/if}
				{#if methodHasCheckStandards}
					{#each Array.from($methodStore.checkStandards?.values() ?? []) as checkStandard (checkStandard.id)}
						<tr class="border-b border-gray-400">
							<td class="first-column">{checkStandard.name}</td>
							{#each elements as element}
								{@const values = $methodStore?.getValue(
									"checkStandards",
									checkStandard.name,
									"checkValues",
									element.id
								)}
								<td class="text-center">{values?.value}</td>
							{/each}
						</tr>
					{/each}
				{/if}

				{#if methodHasBlanks}
					{#each Array.from($methodStore?.blanks?.values() ?? []) as blank (blank.id)}
						<tr class="border-b border-gray-400">
							<td class="first-column items-center gap-2 flex justify-between">
								<div>
									{blank.name}
								</div>
								<div class="table font-normal">
									<div>MDL</div>
									<div>LOQ</div>
								</div>
							</td>
							{#each elements as element}
								{@const values = $methodStore?.getValue(
									"blanks",
									blank.name,
									"detectionLimits",
									element.id
								)}
								<td class="text-center">
									<div class="table mx-auto">
										<div class="table-row">
											<div class="table-cell text-center">
												{values.mdl === 0 ? "- -" : values.mdl}
											</div>
										</div>
										<div>
											{values.loq === 0 ? "- -" : values.loq}
										</div>
									</div>
								</td>
							{/each}
						</tr>
					{/each}
				{/if}

				{#if methodHasReferenceMaterials}
					{#each Array.from($methodStore.referenceMaterials?.values() ?? []) as referenceMaterial (referenceMaterial.id)}
						<tr class="border-b border-gray-400">
							<td class="first-column items-center gap-2 flex justify-between">
								<div>
									{referenceMaterial.name}
								</div>
								<div class="table font-normal">
									<div>Low</div>
									<div>High</div>
								</div>
							</td>
							{#each elements as element}
								{@const values = $methodStore?.getValue(
									"referenceMaterials",
									referenceMaterial.name,
									"ranges",
									element.id
								)}
								<td class="text-center">
									<div class="table mx-auto">
										<div class="table-row">
											<div class="table-cell text-center">
												{values?.lower === 0 ? "- -" : values?.lower}
											</div>
										</div>
										<div>
											{values?.upper === 0 ? "- -" : values?.upper}
										</div>
									</div>
								</td>
							{/each}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
{/if}

<style lang="postcss">
	tr:nth-child(even) {
		@apply bg-gray-100;
	}
	td {
		@apply py-[6px] px-[10px];
	}
	td.first-column {
		@apply font-semibold text-gray-800 text-left;
	}
</style>
