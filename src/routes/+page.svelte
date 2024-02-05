<script lang="ts">
	// @ts-expect-error
	import IconArrowUpLeftCircle from "@tabler/icons-svelte/dist/svelte/icons/IconArrowUpLeftCircle.svelte"
	import {
		setInstrumentContext,
		setInstrumentsContext,
		setMethodContext,
		setMethodsContext
	} from "$lib/storage"
	import type { PageData } from "./$types"
	import SelectInstrument from "$lib/components/SelectInstrument.svelte"
	import MethodSelect from "$lib/components/MethodSelect.svelte"
	import FilePicker from "$lib/components/FilePicker.svelte"
	import MethodParams from "$lib/components/MethodParams.svelte"

	export let data: PageData
	const { instruments, selectedInstrument, methods, selectedMethod } = data

	const method = setMethodContext(methods?.find((m) => m.slug === selectedMethod) ?? null)
	const instrument = setInstrumentContext(selectedInstrument ?? "")

	setMethodsContext(methods ?? [])
	setInstrumentsContext(instruments ?? [])
</script>

<div class="absolute bottom-4 left-4">
	<a class="btn no-underline" href="/edit">Edit stuff</a>
</div>

<div class="align-center p-4">
	<h1 class="mx-auto w-fit text-2xl">JCQC Reporting Application</h1>

	<hr class="mx-auto my-4 max-w-screen-md" />

	<div class="flex-start mx-auto flex max-w-screen-lg gap-12">
		<SelectInstrument />
		<MethodSelect />
	</div>
</div>
{#if $method && !$instrument}
	<div class=" mx-auto flex w-fit gap-2 rounded border border-sky-500 bg-sky-50 px-2 py-1">
		<IconArrowUpLeftCircle class="relative -top-[2px] -rotate-12 stroke-sky-700 stroke-[1.5]" />
		<div class="font-semibold text-sky-600">Select an instrument!</div>
	</div>
{/if}
{#if $method && $instrument}
	<FilePicker />
{/if}

<MethodParams />

<div class="absolute bottom-4 left-4">
	<a class="btn no-underline" href="/edit">Edit stuff</a>
</div>
