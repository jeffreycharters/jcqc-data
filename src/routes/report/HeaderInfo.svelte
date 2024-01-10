<script lang="ts">
	import { instrumentStore, methodStore } from "$lib/stores"
</script>

<div class="mb-4">
	<h1>Sequence Information - {$methodStore?.name}</h1>
	<div class="headerItem">Analyst: _________________________</div>
	<div class="headerItem">Analysis Date: _________________________</div>
	<div class="headerItem">Sequence ID: ______________________________________</div>

	<div class="headerItem">
		Instrument: {$instrument?.name} (Serial Number: {$instrument?.serial})
	</div>
	<div class="headerItem -mt-3">
		Software Version: {$instrument?.softwareVersion}
	</div>
	<div class="headerItem -mt-3">
		Autosampler Info: {$instrument?.autosamplerInfo}
	</div>
</div>

<style lang="postcss">
	.headerItem {
		@apply font-semibold p-[10px] text-sm;
	}
</style>
