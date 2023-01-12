<script lang="ts">
	export let value: number = 0;
	export let label: string;
	export let name: string;
	export let placeholder = '';
</script>

<div class="flex flex-col text-sm">
	<label for={name}>{@html label}</label>
	<input type="text" bind:value {placeholder} />
</div>
