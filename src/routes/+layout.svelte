<script>
	import { page } from '$app/stores';
	import { currentUser } from '$lib/pocketbase';
</script>

<svelte:head>
	<title>{$page.data.title || 'Data Processor'} // JCQC Data Processor</title>
</svelte:head>

<slot />

<div style="margin-top: 10px;">
	{#if $currentUser}
		Logged in as {$currentUser.username}. <a href="/">Home</a> | <a href="/edit">Edit</a>
	{:else}
		Not logged in.
	{/if}
</div>
