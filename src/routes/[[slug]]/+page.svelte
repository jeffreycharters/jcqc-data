<script lang="ts">
	import { instrumentStore, methodStore, referenceMaterialsStore } from "$lib/stores"
	import FilePicker from "./FilePicker.svelte"
	import MethodParams from "./MethodParams.svelte"
	import { IconArrowUpLeftCircle } from "@tabler/icons-svelte"
	import SelectInstrument from "./SelectInstrument.svelte"
	import MethodSelect from "./MethodSelect.svelte"
</script>

<div class="absolute bottom-4 left-4">
	<a class="no-underline btn" href="/edit">Edit stuff</a>
</div>

<div class="p-4">
	<div class="align-center">
		<h1 class="text-2xl w-fit mx-auto">JCQC Reporting Application</h1>

		<hr class="w-[36rem] my-4 mx-auto" />

		<div class="flex w-[800px] mx-auto justify-between place-items-stretch">
			<SelectInstrument />
			<MethodSelect />
		</div>
	</div>
</div>

{#if $methodStore && !$instrumentStore}
	<div class="mx-auto w-fit flex gap-2 border-sky-500 border py-1 px-2 rounded bg-sky-50">
		<IconArrowUpLeftCircle class="-rotate-12 stroke-[1.5] relative -top-[2px] stroke-sky-700" />
		<div class="font-semibold text-sky-600">Select an instrument!</div>
	</div>
{/if}
{#if $methodStore && $instrumentStore}
	<FilePicker />
{/if}

<MethodParams />

<div class="absolute bottom-4 left-4">
	<a class="no-underline btn" href="/edit">Edit stuff</a>
</div>
