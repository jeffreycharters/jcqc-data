<script lang="ts">
	import { method } from '$lib/stores';
	import type { PageData } from './$types';
	import LOQs from './LOQs.svelte';
	import CheckStandards from './CheckStandards.svelte';
	import ReferenceMaterials from './ReferenceMaterials.svelte';
	import EditMethod from './EditMethod.svelte';
	import ElementSelect from './ElementSelect.svelte';

	export let data: PageData;
	let { elementList } = data;
</script>

<h1>{$method.title}</h1>

<EditMethod />

<ElementSelect {elementList} />

<CheckStandards />

<LOQs />

<ReferenceMaterials />
