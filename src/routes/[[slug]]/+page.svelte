<script lang="ts">
	import { method, methods } from '$lib/stores';
	import FilePicker from './FilePicker.svelte';
	import MainPageStuff from './MainPageStuff.svelte';
	import type { PageData } from './$types';
	import MethodParams from './MethodParams.svelte';
	import { fade, fly } from 'svelte/transition';

	export let data: PageData;
	const methodList = data.methods;

	if (methodList) {
		$methods = methodList;
	}

	const transitionDuration = 200;
</script>

<MainPageStuff>
	<FilePicker />
	{#key $method}
		<div in:fly|local={{ x: -20, duration: transitionDuration }}>
			<MethodParams />
		</div>
	{/key}
</MainPageStuff>

<div class="absolute bottom-4 left-4">
	<a class="no-underline btn" href="/edit">Edit stuff</a>
</div>
