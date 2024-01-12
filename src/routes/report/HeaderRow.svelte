<script lang="ts">
	import { methodElementsStore, methodStore, reportData } from "$lib/stores"

	export let firstColumnLabel = ""
</script>

<thead>
	<tr>
		<th class="min-w-[175px] border-b-2 border-b-gray-900 p-[3px] w-[105px] text-left align-bottom"
			>{firstColumnLabel}</th
		>
		{#each $reportData?.meta.orderedElements ?? [] as elementID}
			{@const methodElement = $methodElementsStore?.find(
				(e) => `${e.symbol}${e.mass}` === elementID
			)}
			<th class="heading font-semibold">
				<div
					class="flex {($reportData?.meta.orderedElements.length ?? 0) > 10
						? 'flex-col gap-0'
						: 'gap-1 items-center justify-center'}"
				>
					<div class="leading-[0.5rem]">
						<sup>{methodElement?.mass}</sup>{methodElement?.symbol}
					</div>
					<div class="text-gray-500 font-normal text-[0.7rem]">{methodElement?.units}</div>
				</div>
			</th>
		{/each}
	</tr>
</thead>

<style lang="postcss">
	th.heading {
		@apply border-b-2 border-b-gray-900 w-[105px];
	}
</style>
