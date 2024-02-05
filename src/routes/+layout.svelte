<script lang="ts">
	import "../app.postcss"
	import { page } from "$app/stores"
</script>

<svelte:head>
	<title>{$page.data.title || "Data Processor"} // JCQC Data Processor</title>
</svelte:head>

<slot />
