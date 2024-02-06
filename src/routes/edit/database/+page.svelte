<script lang="ts">
	import { onMount } from "svelte"

	let files: HTMLInputElement["files"]

	import pkg from "file-saver"
	import { browser } from "$app/environment"
	import { db } from "$lib/db"
	const { saveAs } = pkg

	onMount(async () => {
		// @ts-expect-error no typing
		await import("dexie-export-import") // only load in browser
	})

	async function exportLocalDB() {
		if (!browser) return

		// @ts-expect-error pain in the ass
		const jsonDB = await db.export()
		console.log(jsonDB)

		const now = new Date().toLocaleDateString("en-CA")
		saveAs(jsonDB, `${now}-jcqc-export.json`)
	}

	async function importExistingDB(files: FileList | null) {
		if (!browser || !files || !files[0]) return

		const inputFile = files[0]
		if (inputFile.type != "application/json") {
			alert("Incorrect file type, expected application/json received " + inputFile.type)
			return
		}

		// @ts-expect-error yeah this again
		const backup = await db.export()
		await db.delete()
		await db.open()

		// @ts-expect-error y u no have import, db?
		db.import(inputFile)
			// @ts-expect-error y u no have import, db?
			.catch(() => db.import(backup))

		location.reload()
	}
</script>

<h1 class="mt-8">Manage Database</h1>

<div class="my-8 max-w-screen-md rounded bg-stone-100 p-4 shadow">
	<h2 class="mb-2">A quick introduction</h2>

	<p>
		Changes made are only saved to the database in the browser you are currently using. In order to
		keep things in sync, once you've made any changes you'll need to do the following:
	</p>
	<ol class="my-4 list-inside list-decimal">
		<li>On the updated page, click the <strong>Export database</strong> button below.</li>
		<li>
			Save the file to <code class="text-teal-800">TOXI Drive/jcqc-data/DATABASE VERSIONS/</code> on
			the network.
		</li>
		<li>On the other computer, open this page.</li>
		<li>Click the <strong>Import database</strong> button below and select the saved file.</li>

		<p class="mt-4">Your changes should be visible immediately.</p>
	</ol>
</div>

<div class="flex max-w-screen-md justify-between gap-8">
	<button class="basic-border flex-grow px-4 py-1" on:click={exportLocalDB}>Export database</button>
	<label for="dropzone-file" class="basic-border flex-grow cursor-pointer px-4 py-1 text-center">
		<input
			id="dropzone-file"
			type="file"
			class="hidden"
			bind:files
			on:change={() => importExistingDB(files)}
		/>
		Import Database
	</label>
</div>
