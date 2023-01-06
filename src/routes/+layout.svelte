<script>
	import { page } from '$app/stores';
	import { currentUser } from '$lib/pocketbase';
</script>

<svelte:head>
	<title>{$page.data.title || 'Data Processor'} // JCQC Data Processor</title>
</svelte:head>

<slot />

<div>
	{#if $currentUser}
		Logged in as {$currentUser.username}.
	{:else}
		Not logged in.
	{/if}
</div>
