<script lang="ts">
	export let value: string;
	export let label: string;
	export let name: string;
</script>

<div class="flex flex-col text-sm my-2">
	<label for={name}>{label}</label>
	<input type="text" bind:value />
</div>
