<script lang="ts">
	import { method, methods } from '$lib/stores';
	import FilePicker from './FilePicker.svelte';
	import MainPageStuff from './MainPageStuff.svelte';
	import type { PageData } from './$types';
	import MethodParams from './MethodParams.svelte';

	export let data: PageData;
	const methodList = data.methods;

	if (methodList) {
		$methods = methodList;
	}
</script>

<MainPageStuff>
	<FilePicker />
	<MethodParams />
</MainPageStuff>

<div class="absolute bottom-4 left-4">
	<a class="no-underline btn" href="/edit">Edit stuff</a>
</div>
