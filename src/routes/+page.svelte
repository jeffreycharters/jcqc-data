<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser, logout } from '$lib/pocketbase';

	function logoutAndRedirect() {
		logout();
		goto('/', { invalidateAll: true });
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if $currentUser}
	<p><button on:click={logoutAndRedirect}>Log out</button></p>
{/if}

<p><a href="/edit">Edit stuff</a></p>
