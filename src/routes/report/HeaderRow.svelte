<script lang="ts">
	import { methodElementsStore, reportData } from "$lib/stores"

	export let firstColumnLabel = ""
</script>

<thead>
	<tr>
		<th
			class="text-left! w-[105px] min-w-[175px] border-b-2 border-b-stone-900 p-[3px] align-bottom"
			>{firstColumnLabel}</th
		>
		{#each $methodElementsStore ?? [] as methodElement}
			<th class="heading font-semibold">
				<div
					class="flex {$reportData?.meta.elementCount ?? 0 > 10
						? 'flex-col gap-0'
						: 'items-center justify-center gap-1'}"
				>
					<div class="leading-[0.5rem]">
						<sup>{methodElement?.mass}</sup>{methodElement?.symbol}
					</div>
					<div class="text-[0.7rem] font-normal text-gray-500">{methodElement?.units}</div>
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
