<script lang="ts">
	import { goto } from "$app/navigation"
	import { countElements, flattenAnalytes, parseCSV, parseRun } from "$lib/data"
	import { fade } from "svelte/transition"

	// @ts-expect-error
	import IconFileUpload from "@tabler/icons-svelte/dist/svelte/icons/IconFileUpload.svelte"

	let files: HTMLInputElement["files"]
	let errorMessage: string = ""

	const parseInput = async (files: HTMLInputElement["files"]) => {
		if (!files || !files[0]) return
		const inputFile = files[0]
		if (inputFile.type != "text/plain") {
			errorMessage = "Incorrect file type"
			return
		}
		const analysisName = inputFile.name.split(".")[0]
		const analysisDate = analysisName.split("=")[1] ?? undefined
		const structuredOutput = await parseCSV(inputFile)
		const elementCount = countElements(structuredOutput)
		const rawRunlist = flattenAnalytes(structuredOutput, elementCount)
		const runlist = parseRun(rawRunlist)

		localStorage.setItem(
			"reportData",
			JSON.stringify({
				meta: {
					analysisName,
					analysisDate,
					elementCount
				},
				samples: runlist
			})
		)

		goto("/report")
	}
</script>

<div class="mx-auto flex w-fit flex-col gap-2">
	<label for="dropzone-file" class="text-md cursor-pointer font-semibold text-sky-700">
		<div
			class="flex w-full cursor-pointer flex-col gap-1 rounded border-2 border-dashed border-sky-600 bg-sky-200 transition-colors hover:bg-sky-100"
		>
			<input
				id="dropzone-file"
				type="file"
				class="hidden"
				bind:files
				on:change={() => parseInput(files)}
			/>
			<div class="flex items-center justify-center gap-2 px-9 pt-3">
				<IconFileUpload class="h-6 w-6 text-sky-700" />
				Select exported file
			</div>

			<div class="mx-auto mb-3 text-xs italic text-sky-600">Click here or drag-and-drop file</div>
		</div>
	</label>

	{#if errorMessage}
		<div
			transition:fade={{ duration: 200 }}
			class="mx-auto whitespace-nowrap rounded text-sm italic text-red-600"
		>
			{errorMessage ?? ""}
		</div>
	{/if}
</div>
