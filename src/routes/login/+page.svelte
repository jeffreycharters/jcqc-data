<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';

	let username: string;
	let password: string;
	let errorMessage = '';
	let loggingIn = true;
	async function login() {
		try {
			await pb.collection('users').authWithPassword(username, password);
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
			const createdUser = await pb.collection('users').create(data);
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
