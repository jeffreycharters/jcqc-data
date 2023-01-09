<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { currentUser, logout } from '$lib/pocketbase';

	function logoutAndRedirect() {
		logout();
		goto('/', { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>{$page.data.title || 'Data Processor'} // JCQC Data Processor</title>
</svelte:head>

<slot />

<div style="margin-top: 10px;">
	{#if $currentUser}
		<button on:click={logoutAndRedirect}>Log out</button>
		Logged in as {$currentUser.username}. <a href="/">Home</a> | <a href="/edit">Edit</a>
	{:else}
		Not logged in.
	{/if}
</div>
