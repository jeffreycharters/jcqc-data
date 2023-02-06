<!-- <script lang="ts">
	import { methodParams } from '$lib/stores';

	export let firstColumnLabel = '';
</script>

<thead>
	<tr>
		<th class="min-w-[175px] border-b-2 border-b-gray-900 p-[3px] w-[105px] text-left align-bottom"
			>{firstColumnLabel}</th
		>
		{#each $methodParams.elements as element (element.id)}
			<th class="heading font-semibold">
				<div class="flex flex-col gap-0">
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
</style> -->
