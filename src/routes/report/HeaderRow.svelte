<script lang="ts">
	import { getMethodContext, getMethodElementsContext } from "$lib/storage"

	export let firstColumnLabel = ""
	export let ppbUnits = false

	const method = getMethodContext()
	const methodElements = getMethodElementsContext()
</script>

<thead>
	<tr>
		<th
			class="text-left! m-[3px] w-[105px] min-w-[175px] border-b-2 border-b-stone-900 align-bottom"
			>{firstColumnLabel}</th
		>
		{#each $method?.elements ?? [] as element}
			<th class="heading font-semibold">
				<div
					class="flex {($method?.elements?.length ?? 0) > 10
						? 'flex-col gap-0'
						: ' items-end justify-center gap-1'}"
				>
					<div
						class="flex justify-center"
						class:translate-y-[0.35rem]={($method?.elements?.length ?? 0) > 10}
					>
						<div class="-translate-y-[0.1rem] text-[0.6rem]">{element.mass}</div>
						<span>{element.symbol}</span>
					</div>
					<div class="text-[0.7rem] font-normal text-gray-500">
						{ppbUnits ? "ppb" : $methodElements?.find((me) => me.element === element.id)?.units}
					</div>
				</div>
			</th>
		{/each}
	</tr>
</thead>

<style lang="postcss">
	th.heading {
		@apply w-[105px] border-b-2 border-b-gray-900;
	}
</style>
