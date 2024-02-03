<script lang="ts">
	// import LOQs from "./LOQs.svelte"
	import CheckStandards from "./CheckStandards.svelte"
	// import ReferenceMaterials from "./ReferenceMaterials.svelte"
	import EditMethod from "./EditMethod.svelte"
	import ElementSelect from "./ElementSelect.svelte"
	import type { PageData } from "./$types"
	import {
		setCheckStandardsContext,
		setElementsContext,
		setMethodContext,
		setMethodElementsContext
	} from "$lib/storage"

	export let data: PageData

	const method = setMethodContext(data.currentMethod ?? null)
	setElementsContext(data.elementList ?? [])
	setMethodElementsContext(data.methodElements ?? [])
	setCheckStandardsContext(data.checkStandards ?? [])
</script>

<div class="mb-6 mt-8 w-full max-w-screen-xl">
	<h1>{$method?.name}: {$method?.description}</h1>

	<EditMethod />

	<ElementSelect />

	<CheckStandards />

	<!-- 
	<LOQs />

	<ReferenceMaterials /> -->
</div>
