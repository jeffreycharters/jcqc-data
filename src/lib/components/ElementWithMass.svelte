<script lang="ts">
	export let symbol: string;
	export let mass: number;
	export let bold: boolean = true;
</script>

<div class="{bold ? 'font-bold' : ''} relative flex items-center justify-center">
	<div>{symbol}</div>
	<div class="absolute right-full top-0">
		<sup>{mass.toString()}</sup>
	</div>
</div>
