<script lang="ts">
	import CheckStandards from "./CheckStandards.svelte"
	import ReferenceMaterials from "./ReferenceMaterials.svelte"
	import EditMethod from "./EditMethod.svelte"
	import ElementSelect from "./ElementSelect.svelte"
	import type { PageData } from "./$types"
	import {
		setBlanksContext,
		setCheckStandardsContext,
		setElementsContext,
		setMethodContext,
		setMethodElementsContext,
		setReferenceMaterialsContext
	} from "$lib/storage"
	import Blanks from "./Blanks.svelte"

	export let data: PageData

	const method = setMethodContext(data.currentMethod ?? null)
	setElementsContext(data.elementList ?? [])
	setMethodElementsContext(data.methodElements ?? [])
	setCheckStandardsContext(data.checkStandards ?? [])
	setBlanksContext(data.blanks ?? [])
	setReferenceMaterialsContext(data.referenceMaterials ?? [])
</script>

<div class="mb-6 mt-8 w-full max-w-screen-xl">
	<h1>{$method?.name}: {$method?.description}</h1>

	<EditMethod />

	<ElementSelect />

	<CheckStandards />

	<Blanks />

	<ReferenceMaterials />
</div>
