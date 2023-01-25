<script lang="ts">
	export let value: number | undefined = undefined;
	export let label: string = '';
	export let name: string;
	export let placeholder = '';
</script>

<div class="flex flex-col text-sm my-2">
	<label for={name}>{@html label}</label>
	<input type="text" {name} class="number-input" bind:value {placeholder} />
</div>
