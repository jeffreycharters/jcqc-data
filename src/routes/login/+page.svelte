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
			return goto(next, { invalidateAll: true });
		}
	}

	redirectLoggedInUser();

	async function login() {
		try {
			const user = await pb.collection('users').authWithPassword(username, password);
			pb.authStore.save(user.token, user.record);
			redirectLoggedInUser();
		} catch (err) {
			errorMessage = (err as Error).message;
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
	<div class="border p-4 mt-4 mx-auto w-fit rounded">
		<h1 class="text-xl font-bold text-center mb-4">Login</h1>
		<form on:submit|preventDefault class="mx-auto w-fit flex flex-col space-y-2">
			<input placeholder="Username" type="text" bind:value={username} class="text-input" />

			<input placeholder="Password" type="password" bind:value={password} class="text-input" />

			{#if loggingIn}
				<button on:click={login} class="bg-stone-300 shadow rounded py-1">Login</button>
			{:else}
				<button on:click={signUp} class="bg-stone-300 shadow rounded py-1">Sign Up</button>
			{/if}
			<button on:click={toggleLogin} class="border rounded py-1 border-stone-300 text-stone-700"
				>{loggingIn ? 'Sign up?' : 'Log in?'}</button
			>
		</form>
		<div>{errorMessage || ''}</div>
	</div>
{/if}
