<script lang="ts">
	import { instrumentStore, methodStore, reportData } from "$lib/stores"
	import { IconPrinter, IconPrinterOff } from "@tabler/icons-svelte"

	let printAnalysisDate = true
	let printAnalysisName = true
</script>

<div class="header-info mb-4">
	<h1 class="mb-2">Sequence Information - {$methodStore?.name}</h1>

	<div class="max-w-xs ml-4">
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
				on:click={() => (printAnalysisDate = !printAnalysisDate)}
				class="no-print"
				class:text-stone-400={!printAnalysisDate}
			>
				<svelte:component
					this={printAnalysisDate ? IconPrinterOff : IconPrinter}
					class="w-4 h-4 text-stone-600"
				/>
			</button>
		</div>

		<div class="headerItem py-1">
			Sequence ID: <div class="autofilled">
				<span class:no-print={!printAnalysisName} class:text-stone-300={!printAnalysisName}
					>{$reportData?.meta.analysisName}</span
				>
			</div>
			<button
				on:click={() => (printAnalysisName = !printAnalysisName)}
				class="no-print"
				class:text-stone-400={!printAnalysisName}
			>
				<svelte:component
					this={printAnalysisName ? IconPrinterOff : IconPrinter}
					class="w-4 h-4 text-stone-600"
				/>
			</button>
		</div>
	</div>

	<div class="bg-stone-100 rounded py-2 px-4 w-fit mt-2 text-xs">
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
		@apply font-semibold px-2 text-sm flex items-baseline gap-2;
	}

	.autofilled {
		@apply border-b border-b-black inline-block pl-3 font-mono font-normal leading-3 flex-grow;
	}
</style>
