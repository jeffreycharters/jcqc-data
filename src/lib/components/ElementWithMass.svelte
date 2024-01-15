<script lang="ts">
	export let symbol: string
	export let mass: number
</script>

<div class="flex items-center justify-center {$$props.class}">
	<sup>{mass}</sup>
	<div>{symbol}</div>
</div>
