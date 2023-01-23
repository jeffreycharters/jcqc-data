<script lang="ts">
	import { methodParams } from '$lib/stores';

	export let firstColumnLabel = '';
</script>

<thead>
	<tr>
		<th class="min-w-[175px] border-b-2 border-b-gray-900 p-[3px] w-[105px] text-left"
			>{firstColumnLabel}</th
		>
		{#each $methodParams.elements as element (element.id)}
			<th class="heading">
				<sup>{element.mass}</sup>{element.symbol}
				<span class="text-gray-500 font-normal">{element.units}</span>
			</th>
		{/each}
	</tr>
</thead>

<style lang="postcss">
	th.heading {
		@apply border-b-2 border-b-gray-900 p-[3px] w-[105px];
	}
</style>
