<script lang="ts">
	import { instrumentStore, methodStore, methods } from "$lib/stores"
	import FilePicker from "./FilePicker.svelte"
	import MainPageStuff from "./MainPageStuff.svelte"
	import type { PageData } from "./$types"
	import MethodParams from "./MethodParams.svelte"
	import { fade } from "svelte/transition"
	import { IconArrowUpLeftCircle } from "@tabler/icons-svelte"

	export let data: PageData
	const methodList = data.methods

	if (methodList) {
		$methods = methodList
	}
</script>

<MainPageStuff>
	{#if $methodStore && !$instrumentStore}
		<div
			class="mx-auto w-fit flex gap-2 border-sky-500 border py-1 px-2 rounded bg-sky-50 text-sky-800"
		>
			<IconArrowUpLeftCircle class="-rotate-12 stroke-[1.5] relative -top-1 stroke-sky-800" />
			<div>Select an instrument!</div>
		</div>
	{/if}
	{#if $methodStore && $instrumentStore}
		<FilePicker />
	{/if}
	{#key $methodStore}
		<div in:fade|local={{ duration: 100 }}>
			<MethodParams />
		</div>
	{/key}
</MainPageStuff>

<div class="absolute bottom-4 left-4">
	<a class="no-underline btn" href="/edit">Edit stuff</a>
</div>
