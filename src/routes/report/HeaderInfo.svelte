<script lang="ts">
	import { instrumentStore, methodStore, reportData } from "$lib/stores"
</script>

<div class="mb-4">
	<h1>Sequence Information - {$methodStore?.name}</h1>
	<div class="headerItem mt-2">
		<div>Analyst:</div>
		<div class="autofilled w-48">&nbsp;</div>
	</div>
	<div class="headerItem">
		Analysis Date: <div class="autofilled w-48">
			{$reportData?.meta.analysisDate}
		</div>
	</div>
	<div class="headerItem">
		Sequence ID: <div class="autofilled w-64">
			{$reportData?.meta.analysisName}
		</div>
	</div>

	<div class="headerItem">
		Instrument:
		<span class="font-normal">
			{$instrumentStore?.name}
			(Serial Number: {$instrumentStore?.serial})
		</span>
	</div>
	<div class="headerItem -mt-3">
		Software Version:
		<span class="font-normal">{$instrumentStore?.softwareVersion}</span>
	</div>
	<div class="headerItem -mt-3">
		Autosampler Model: <span class="font-normal">{$instrumentStore?.autosamplerInfo}</span>
	</div>
</div>

<style lang="postcss">
	.headerItem {
		@apply font-semibold px-2 py-[6px] text-sm flex items-baseline gap-2 max-w-sm;
	}

	.autofilled {
		@apply border-b border-b-black inline-block pl-3 font-mono font-normal leading-3 flex-grow;
	}
</style>
