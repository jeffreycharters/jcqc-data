<script lang="ts">
	export let symbol: string;
	export let mass: number;
</script>

<div class="font-bold relative">
	<div>{symbol}</div>
	<div class="absolute right-full top-0">
		<sup>{mass.toString()}</sup>
	</div>
</div>
