<script lang="ts">
	import { methods } from "$lib/stores"
</script>

<div class="mb-6 mt-8 w-full max-w-screen-xl">
	<h1 class="mb-4">Test Files</h1>

	<div class="mb-4 max-w-xl rounded border border-stone-800 px-8 py-4">
		<h2>How to use these files</h2>

		<p>
			These files are used to test the application and ensure that the expected values are being
			produced for the report.
		</p>

		<p>
			Once you select a method, the browser will download a file containing the test data. This can
			then be used as an input file on the <a href="/">main page</a> to verify that the application is
			working as expected.
		</p>
	</div>

	<div class="grid grid-cols-3 gap-2">
		{#each $methods ?? [] as method (method.id)}
			<a class="rounded border border-stone-800 p-4" href="/edit/testfiles/download/{method.slug}">
				<h2 class="text-stone-700">{method.name}</h2>
				<hr />
				<p class="text-stone-500">{method.description}</p>
			</a>
		{/each}
	</div>
</div>

<style lang="postcss">
	p {
		@apply py-2;
	}
</style>
