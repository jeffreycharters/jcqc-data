<script lang="ts">
	import Menu from "./Menu.svelte"
</script>

<div class="flex w-full gap-12 px-4" data-sveltekit-preload-data="off">
	<Menu />

	<div class="w-full">
		<slot />
	</div>
</div>
