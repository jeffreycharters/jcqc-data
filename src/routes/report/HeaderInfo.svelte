<script lang="ts">
	import { instrumentStore, methodStore, reportData } from "$lib/stores"
</script>

<div class="mb-4">
	<h1 class="mb-2">Sequence Information - {$methodStore?.name}</h1>

	<div class="max-w-xs">
		<div class="headerItem mt-2 py-1">
			<div>Analyst:</div>
			<div class="autofilled">&nbsp;</div>
		</div>
		<div class="headerItem py-1">
			Analysis Date: <div class="autofilled">
				{$reportData?.meta.analysisDate}
			</div>
		</div>
		<div class="headerItem py-1">
			Sequence ID: <div class="autofilled">
				{$reportData?.meta.analysisName}
			</div>
		</div>
	</div>

	<div class="bg-stone-100 rounded py-2 px-4 w-fit mt-2">
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
