<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { currentUser, pb } from '$lib/pocketbase';

	let username: string;
	let password: string;
	let errorMessage = '';
	let loggingIn = true;

	function redirectLoggedInUser() {
		if ($currentUser && browser) {
			const next = $page.url.searchParams.get('next') || '/edit';
			goto(next, { invalidateAll: true });
		}
	}

	redirectLoggedInUser();

	async function login() {
		try {
			await pb.collection('users').authWithPassword(username, password);
			redirectLoggedInUser();
		} catch (err) {
			const error = err as Error;
			errorMessage = error.message;
		}
	}
	async function signUp() {
		try {
			const data = {
				username,
				password,
				passwordConfirm: password,
				name: 'New User'
			};
			await pb.collection('users').create(data);
			await login();
		} catch (err) {
			const error = err as Error;
			errorMessage = error.message;
		}
	}
	function signOut() {
		pb.authStore.clear();
	}

	function toggleLogin() {
		loggingIn = !loggingIn;
	}
</script>

{#if $currentUser}
	<p>
		Signed in as {$currentUser.username}
		<button on:click={signOut}>Sign Out</button>
	</p>
{:else}
	<form on:submit|preventDefault>
		<input placeholder="Username" type="text" bind:value={username} />

		<input placeholder="Password" type="password" bind:value={password} />

		{#if loggingIn}
			<button on:click={login}>Login</button>
		{:else}
			<button on:click={signUp}>Sign Up</button>
		{/if}
		<button on:click={toggleLogin}>{loggingIn ? 'Sign up?' : 'Log in?'}</button>
	</form>
	<div>{errorMessage || ''}</div>
{/if}
