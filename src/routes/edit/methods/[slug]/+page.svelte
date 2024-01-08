<script lang="ts">
	import { method } from "$lib/stores"
	import type { PageData } from "./$types"
	import LOQs from "./LOQs.svelte"
	import CheckStandards from "./CheckStandards.svelte"
	import ReferenceMaterials from "./ReferenceMaterials.svelte"
	import EditMethod from "./EditMethod.svelte"
	import ElementSelect from "./ElementSelect.svelte"
</script>

<h1>{$method?.name}: {$method?.description}</h1>

<EditMethod />

<ElementSelect />

<CheckStandards />

<LOQs />

<ReferenceMaterials />
