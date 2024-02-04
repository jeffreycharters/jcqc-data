<script lang="ts">
	import { db, type Method, type MethodElement } from "$lib/db"
	import { getMethodContext } from "$lib/storage"

	const method = getMethodContext()

	let lowElementCount: boolean
	let fullMethod: Method | undefined
	let methodElements: MethodElement[]

	method.subscribe(async (value) => {
		if (!value) return (fullMethod = undefined)
		methodElements = await db.methodElements.where("method").equals(value.slug).toArray()

		const usedElementIDs = methodElements.map((methodElement) => methodElement.element)
		const usedElements = (await db.elements.where("id").anyOf(usedElementIDs).toArray()).toSorted(
			(a, b) => a.mass - b.mass
		)
		const checkStandards = await db.checkStandards.where("method").equals(value.slug).toArray()
		const blanks = await db.blanks.where("method").equals(value.slug).toArray()
		const referenceMaterials = await db.referenceMaterials
			.where("method")
			.equals(value.slug)
			.toArray()

		lowElementCount = (fullMethod?.elements ?? []).length < 15

		fullMethod = {
			...value,
			elements: usedElements ?? [],
			checkStandards,
			blanks,
			referenceMaterials
		}

		localStorage.setItem("fullMethod", JSON.stringify(fullMethod))
	})
</script>

{#if fullMethod}
	<div class="mx-auto w-fit">
		<div
			class="flex {lowElementCount
				? 'flex-col gap-4'
				: 'justify-between gap-8'} my-8 flex-wrap items-end"
		>
			<h2 class="flex-grow border-b text-2xl {lowElementCount ? 'self-start' : 'self-end'}">
				{fullMethod.name}: {fullMethod.description}
			</h2>

			<div class="flex items-stretch gap-4">
				<div class="rouded flex flex-col items-center bg-gray-50 px-4 py-2 shadow">
					<div class="text-xl font-bold text-gray-500">
						{fullMethod.checkStandardTolerance}%
					</div>
					<div class="text-center text-sm font-semibold text-gray-400">
						Check Standard Tolerance
					</div>
				</div>

				<div class="rouded flex flex-col items-center bg-gray-50 px-4 py-2 shadow">
					<div class="text-xl font-bold text-gray-500">
						{fullMethod.rpdLimit}%
					</div>
					<div class="text-center text-sm font-semibold text-gray-400">Duplicate RPD</div>
				</div>

				<div class="rouded flex flex-col items-center bg-gray-50 px-4 py-2 shadow">
					<div class="text-xl font-bold text-gray-500">
						{fullMethod.calibrationCount}
					</div>
					<div class="text-center text-sm font-semibold text-gray-400">Non-blank Standards</div>
				</div>

				<div class="rouded flex flex-col items-center bg-gray-50 px-4 py-2 shadow">
					<div class="text-xl font-bold text-gray-500">
						{fullMethod.reportSigFigs}
					</div>
					<div class="text-center text-sm font-semibold text-gray-400">Sig figs on Report</div>
				</div>
			</div>
		</div>
		<table class="mx-auto my-2 w-fit text-sm">
			<thead>
				<tr class="border-b border-gray-400">
					<th class="first-column max-w-xs text-sm">Elements</th>
					{#each fullMethod.elements ?? [] as element}
						<th class="px-2 text-center text-sm font-semibold">
							<sup>{element.mass}</sup>{element.symbol}
						</th>
					{/each}
				</tr>
			</thead>

			<tbody>
				{#if (fullMethod.elements ?? []).length > 0}
					<tr>
						<td class="first-column">Units</td>
						{#each fullMethod.elements ?? [] as element}
							{@const methodElement = methodElements?.find((e) => e.element === element.id)}
							<td class="text-center">{methodElement?.units}</td>
						{/each}
					</tr>
				{/if}
				{#each fullMethod.checkStandards ?? [] as checkStandard (checkStandard.id)}
					<tr class="border-b border-gray-400">
						<td class="first-column">{checkStandard.name}</td>
						{#each fullMethod.elements ?? [] as element}
							<td class="text-center">{checkStandard.values[element.id] ?? "- -"}</td>
						{/each}
					</tr>
				{/each}

				{#each fullMethod.blanks ?? [] as blank (blank.id)}
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
						{#each fullMethod.elements ?? [] as element}
							<td class="text-center">
								<div class="mx-auto table">
									<div class="table-row">
										<div class="table-cell text-center">
											{blank.mdls[element.id] ?? "- -"}
										</div>
									</div>
									<div>
										{blank.loqs[element.id] ?? "- -"}
									</div>
								</div>
							</td>
						{/each}
					</tr>
				{/each}

				{#each fullMethod.referenceMaterials?.filter((rm) => rm.active) ?? [] as referenceMaterial (referenceMaterial.id)}
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
						{#each fullMethod.elements ?? [] as element}
							<td class="text-center">
								<div class="mx-auto table">
									<div class="table-row">
										<div class="table-cell text-center">
											{referenceMaterial.lower[element.id] ?? "- -"}
										</div>
									</div>
									<div>
										{referenceMaterial.upper[element.id] ?? "- -"}
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
