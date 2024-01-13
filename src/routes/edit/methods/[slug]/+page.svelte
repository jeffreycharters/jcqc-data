<script lang="ts">
	import { methodStore } from "$lib/stores"
	import LOQs from "./LOQs.svelte"
	import CheckStandards from "./CheckStandards.svelte"
	import ReferenceMaterials from "./ReferenceMaterials.svelte"
	import EditMethod from "./EditMethod.svelte"
	import ElementSelect from "./ElementSelect.svelte"
</script>

<div class="max-w-screen-lg">
	<h1>{$methodStore?.name}: {$methodStore?.description}</h1>

	<EditMethod />

	<ElementSelect />

	<CheckStandards />

	<LOQs />

	<ReferenceMaterials />
</div>
