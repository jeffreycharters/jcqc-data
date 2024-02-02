<script lang="ts">
	import "../app.postcss"
	import { goto } from "$app/navigation"
	import { page } from "$app/stores"
	import { currentUser } from "$lib/stores"

	function logoutAndRedirect() {
		console.log("logging you out!")
		goto("/", { invalidateAll: true })
	}
</script>

<svelte:head>
	<title>{$page.data.title || "Data Processor"} // JCQC Data Processor</title>
</svelte:head>

<slot />

{#if $page.url.pathname != "/report"}
	<div class="no-print fixed bottom-4 right-4">
		{#if $currentUser}
			Logged in as {$currentUser}.
			<button class="btn" on:click={logoutAndRedirect}>Log out</button>
		{:else}
			Not logged in.
		{/if}
	</div>
{/if}
