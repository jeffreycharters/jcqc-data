<script lang="ts">
	import { browser } from "$app/environment"
	import { page } from "$app/stores"
	import { onMount } from "svelte"
	import { db } from "$lib/db"

	import pkg from "file-saver"
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
		saveAs(jsonDB, `${now}-dexie-export.json`)
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

		window.location.href = "/edit"
	}

	const menuLinks = [
		{ text: "JCQC Main", href: "/" },
		{ text: "Edit Methods", href: "/edit" },
		{ text: "Edit Elements", href: "/edit/elements" },
		{ text: "Edit Instruments", href: "/edit/instruments" },
		{ text: "Generate Test Files", href: "/edit/testfiles" }
	]

	let files: HTMLInputElement["files"]
</script>

<ul class="relative top-12 flex w-48 flex-col gap-2">
	{#each menuLinks as link}
		<a
			class="basic-border px-2 py-1 no-underline"
			class:bg-teal-200={$page.url.pathname === link.href}
			href={link.href}
		>
			<li>
				{link.text}
			</li>
		</a>
	{/each}

	<li>
		<button class="basic-border w-full px-2 py-1 text-left" on:click={exportLocalDB}
			>Export database</button
		>
	</li>
	<li>
		<label
			for="dropzone-file"
			class="basic-border flex min-w-full cursor-pointer px-2 py-1 text-left"
		>
			<input
				id="dropzone-file"
				type="file"
				class="hidden"
				bind:files
				on:change={() => importExistingDB(files)}
			/>
			Import Database
		</label>
	</li>
</ul>
