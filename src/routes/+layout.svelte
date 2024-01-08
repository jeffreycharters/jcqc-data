<script lang="ts">
	import '../app.postcss';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { logout } from '$lib/pocketbase';
	import { currentUser } from '$lib/pocketbase';

	function logoutAndRedirect() {
		logout();
		goto('/', { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>{$page.data.title || 'Data Processor'} // JCQC Data Processor</title>
</svelte:head>

<slot />

<div class="fixed bottom-4 right-4 no-print">
	{#if $currentUser}
		Logged in as {$currentUser?.username}.
		<button class="btn" on:click={logoutAndRedirect}>Log out</button>
	{:else}
		Not logged in.
	{/if}
</div>
