<script lang="ts">
	import MethodSelect from "./method/[[slug]]/MethodSelect.svelte"
	import SelectInstrument from "./method/[[slug]]/SelectInstrument.svelte"
</script>

<div class="absolute bottom-4 left-4">
	<a class="btn no-underline" href="/edit">Edit stuff</a>
</div>

<div class="align-center p-4">
	<h1 class="mx-auto w-fit text-2xl">JCQC Reporting Application</h1>

	<hr class="mx-auto my-4 max-w-screen-md" />

	<div class="flex-start mx-auto flex max-w-screen-lg gap-12">
		<SelectInstrument />
		<MethodSelect />
	</div>
</div>

<div class="absolute bottom-4 left-4">
	<a class="btn no-underline" href="/edit">Edit stuff</a>
</div>
