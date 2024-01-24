<script lang="ts">
	import {
		blanksStore,
		checkStandardsStore,
		methodElementsStore,
		methodStore,
		referenceMaterialsStore
	} from "$lib/stores"

	const elements = $methodElementsStore?.sort((a, b) => a.mass - b.mass) ?? []
	const lowElementCount = elements && elements?.length < 15
</script>

{#if $methodStore}
	<div class="mx-auto w-fit">
		<div
			class="flex {lowElementCount
				? 'flex-col gap-4'
				: 'justify-between gap-8'} my-8 flex-wrap items-end"
		>
			<h2 class="flex-grow border-b text-2xl {lowElementCount ? 'self-start' : 'self-end'}">
				{$methodStore.name}: {$methodStore.description}
			</h2>

			<div class="flex items-stretch gap-4">
				<div class="rouded flex flex-col items-center bg-gray-50 px-4 py-2 shadow">
					<div class="text-xl font-bold text-gray-500">
						{#if $methodStore.checkStandardTolerance}
							{$methodStore.checkStandardTolerance}%
						{:else}
							- -
						{/if}
					</div>
					<div class="text-center text-sm font-semibold text-gray-400">
						Check Standard Tolerance
					</div>
				</div>

				<div class="rouded flex flex-col items-center bg-gray-50 px-4 py-2 shadow">
					<div class="text-xl font-bold text-gray-500">
						{#if $methodStore.rpdLimit}
							{$methodStore.rpdLimit}%
						{:else}
							- -
						{/if}
					</div>
					<div class="text-center text-sm font-semibold text-gray-400">Duplicate RPD</div>
				</div>

				<div class="rouded flex flex-col items-center bg-gray-50 px-4 py-2 shadow">
					<div class="text-xl font-bold text-gray-500">
						{#if $methodStore.calibrationCount}
							{$methodStore.calibrationCount}
						{:else}
							- -
						{/if}
					</div>
					<div class="text-center text-sm font-semibold text-gray-400">Non-blank Standards</div>
				</div>

				<div class="rouded flex flex-col items-center bg-gray-50 px-4 py-2 shadow">
					<div class="text-xl font-bold text-gray-500">
						{#if $methodStore}
							3
						{:else}
							??
						{/if}
					</div>
					<div class="text-center text-sm font-semibold text-gray-400">Sig figs on Report</div>
				</div>
			</div>
		</div>
		<table class="mx-auto my-2 w-fit text-sm">
			<thead>
				<tr class="border-b border-gray-400">
					<th class="first-column max-w-xs text-sm">Elements</th>
					{#each elements as element}
						<th class="px-2 text-center text-sm font-semibold">
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
				{#each $checkStandardsStore ?? [] as checkStandard (checkStandard.id)}
					<tr class="border-b border-gray-400">
						<td class="first-column">{checkStandard.name}</td>
						{#each elements as element}
							{@const values = checkStandard.expand?.["checkValues(checkStandard)"].find(
								(cv) => cv.element === element.elementID
							)}
							<td class="text-center">{values?.value ?? "- -"}</td>
						{/each}
					</tr>
				{/each}

				{#each $blanksStore ?? [] as blank (blank.id)}
					<tr class="border-b border-gray-400">
						<td class="first-column flex items-center justify-between gap-2">
							<div>
								{blank.name}
							</div>
							<div class="table font-normal">
								<div>MDL</div>
								<div>LOQ</div>
							</div>
						</td>
						{#each elements as element}
							{@const values = blank.expand?.["detectionLimits(blank)"].find(
								(dl) => dl.element === element.elementID
							)}
							<td class="text-center">
								<div class="mx-auto table">
									<div class="table-row">
										<div class="table-cell text-center">
											{!values?.mdl ? "- -" : values.mdl}
										</div>
									</div>
									<div>
										{!values?.loq ? "- -" : values.loq}
									</div>
								</div>
							</td>
						{/each}
					</tr>
				{/each}

				{#each $referenceMaterialsStore?.filter((rm) => rm.active) ?? [] as referenceMaterial (referenceMaterial.id)}
					<tr class="border-b border-gray-400">
						<td class="first-column flex items-center justify-between gap-2">
							<div>
								{referenceMaterial.name}
							</div>
							<div class="table font-normal">
								<div>Low</div>
								<div>High</div>
							</div>
						</td>
						{#each elements as element}
							{@const values = referenceMaterial.expand?.[
								"referenceMaterialsRanges(referenceMaterial)"
							].find((rmr) => rmr.element === element.elementID)}
							<td class="text-center">
								<div class="mx-auto table">
									<div class="table-row">
										<div class="table-cell text-center">
											{!values?.lower ? "- -" : values?.lower}
										</div>
									</div>
									<div>
										{!values?.upper ? "- -" : values?.upper}
									</div>
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style lang="postcss">
	tr:nth-child(even) {
		@apply bg-gray-100;
	}
	td {
		@apply px-[10px] py-[6px];
	}
	td.first-column {
		@apply text-left font-semibold text-gray-800;
	}
</style>
