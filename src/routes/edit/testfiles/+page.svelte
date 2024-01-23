<script lang="ts">
	import type { MethodsResponse } from "$lib/pocketbase-types"
	import { methods } from "$lib/stores"
	import { methodTestOutput } from "$lib/testfiles"
	import pkg from "file-saver"
	const { saveAs } = pkg

	async function download(method: MethodsResponse) {
		const output = new Blob([await methodTestOutput(method.id)], { type: "text/csv;charset=utf-8" })
		const now = new Date().toLocaleDateString("en-CA")
		saveAs(output, `TEST-${now}=${method.name}.txt`)
	}
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
			<button
				class="rounded border border-stone-800 p-4 text-left"
				on:click={() => download(method)}
			>
				<h2 class="text-stone-700">{method.name}</h2>
				<hr />
				<p class="text-stone-500">{method.description}</p>
			</button>
		{/each}
	</div>
</div>

<style lang="postcss">
	p {
		@apply py-2;
	}
</style>
