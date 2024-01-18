<script lang="ts">
	export let rows: string[]
</script>

{#each rows as row}
	<div>{row}</div>
{/each}
