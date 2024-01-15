<script lang="ts">
	import { createTooltip, melt } from "@melt-ui/svelte"
	import { fade } from "svelte/transition"
	import { instrumentStore, methodStore, reportData } from "$lib/stores"

	// @ts-expect-error
	import IconPrinter from "@tabler/icons-svelte/dist/svelte/icons/IconPrinterOff.svelte"
	// @ts-expect-error
	import IconPrinterOff from "@tabler/icons-svelte/dist/svelte/icons/IconPrinter.svelte"

	const {
		elements: { trigger: dateTrigger, content: dateContent, arrow: dateArrow },
		states: { open: dateOpen }
	} = createTooltip({
		positioning: {
			placement: "right"
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: true
	})

	const {
		elements: { trigger: nameTrigger, content: nameContent, arrow: nameArrow },
		states: { open: nameOpen }
	} = createTooltip({
		positioning: {
			placement: "right"
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: true
	})

	let printAnalysisDate = true
	let printAnalysisName = true
</script>

<div class="header-info mb-4">
	<h1 class="mb-2">Sequence Information - {$methodStore?.name}</h1>

	<div class="ml-4 max-w-xs">
		<div class="headerItem mt-2 py-1">
			<div>Analyst:</div>
			<div class="autofilled">&nbsp;</div>
		</div>

		<div class="headerItem py-1">
			Analysis Date: <div class="autofilled">
				<span class:no-print={!printAnalysisDate} class:text-stone-300={!printAnalysisDate}
					>{$reportData?.meta.analysisDate}</span
				>
			</div>
			<button
				type="button"
				use:melt={$dateTrigger}
				aria-label="Toggle printing analysis date"
				on:click={() => (printAnalysisDate = !printAnalysisDate)}
				class="no-print"
				class:text-stone-400={!printAnalysisDate}
			>
				<svelte:component
					this={printAnalysisDate ? IconPrinterOff : IconPrinter}
					class="-my-1 h-5 w-5 rounded-sm border bg-stone-200 stroke-stone-600 p-[2px]"
				/>
			</button>

			{#if $dateOpen}
				<div
					use:melt={$dateContent}
					transition:fade={{ duration: 100 }}
					class="roundedg z-10 bg-sky-100 shadow-lg"
				>
					<div use:melt={$dateArrow} />
					<p class="px-4 py-1 text-sky-900">
						Click to <em>{printAnalysisDate ? "not" : ""}</em> print analysis date
					</p>
				</div>
			{/if}
		</div>

		<div class="headerItem py-1">
			Sequence ID: <div class="autofilled">
				<span class:no-print={!printAnalysisName} class:text-stone-300={!printAnalysisName}
					>{$reportData?.meta.analysisName}</span
				>
			</div>
			<button
				type="button"
				aria-label="Toggle printing analysis name"
				use:melt={$nameTrigger}
				on:click={() => (printAnalysisName = !printAnalysisName)}
				class="no-print"
				class:text-stone-400={!printAnalysisName}
			>
				<svelte:component
					this={printAnalysisName ? IconPrinterOff : IconPrinter}
					class="-my-1 h-5 w-5 rounded-sm border bg-stone-200 stroke-stone-600 p-[2px]"
				/>
			</button>

			{#if $nameOpen}
				<div
					use:melt={$nameContent}
					transition:fade={{ duration: 100 }}
					class="z-10 rounded bg-sky-100 shadow-lg"
				>
					<div use:melt={$nameArrow} class="bg-red-800" />
					<p class="px-4 py-1 text-sky-900">
						Click to <em>{printAnalysisName ? "not" : ""}</em> print analysis name
					</p>
				</div>
			{/if}
		</div>
	</div>

	<div class="mt-2 w-fit rounded bg-stone-100 px-4 py-2 text-xs">
		<div class="headerItem py-[1px]">
			Instrument Name:
			<span class="font-normal">
				{$instrumentStore?.name}
				(Serial number: {$instrumentStore?.serial})
			</span>
		</div>
		<div class="headerItem py-[1px]">
			Software Version:
			<span class="font-normal">{$instrumentStore?.softwareVersion}</span>
		</div>
		<div class="headerItem py-[1px]">
			Autosampler: <span class="font-normal">{$instrumentStore?.autosamplerInfo}</span>
		</div>
	</div>
</div>

<style lang="postcss">
	.headerItem {
		@apply flex items-baseline gap-2 px-2 text-sm font-semibold;
	}

	.autofilled {
		@apply inline-block flex-grow border-b border-b-black pl-3 font-mono font-normal leading-3;
	}
</style>
