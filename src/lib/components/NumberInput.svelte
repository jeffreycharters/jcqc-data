<script lang="ts">
	export let value: number;
	export let label: string;
	export let name: string;
	export let placeholder = '';
</script>

<div class="flex flex-col text-sm my-2">
	<label for={name}>{label}</label>
	<input type="text" bind:value {placeholder} />
</div>
