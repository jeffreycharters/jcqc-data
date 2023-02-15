<script lang="ts">
	import { method } from '$lib/stores';

	export let firstColumnLabel = '';
	$: elementCount = $method?.elements?.length || 0;
</script>

<thead>
	<tr>
		<th class="min-w-[175px] border-b-2 border-b-gray-900 p-[3px] w-[105px] text-left align-bottom"
			>{firstColumnLabel}</th
		>
		{#each [...($method?.elements ?? [])] as element (element.id)}
			<th class="heading font-semibold">
				<div
					class="flex {elementCount > 10 ? 'flex-col gap-0' : 'gap-1 items-center justify-center'}"
				>
					<div class="leading-[0.5rem]">
						<sup>{element.mass}</sup>{element.symbol}
					</div>
					<div class="text-gray-500 font-normal text-[0.7rem]">{element.units}</div>
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
