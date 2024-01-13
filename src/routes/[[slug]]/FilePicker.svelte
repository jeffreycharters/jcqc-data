<script lang="ts">
	import { goto } from "$app/navigation"
	import { findElementOrder, flattenAnalytes, parseCSV, parseRun } from "$lib/data"
	import { reportData } from "$lib/stores"
	import { IconFileUpload } from "@tabler/icons-svelte"
	import { fade } from "svelte/transition"

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
		const elementOrder = findElementOrder(structuredOutput)

		const rawRunlist = flattenAnalytes(structuredOutput, elementOrder.length)
		const runlist = parseRun(rawRunlist)

		$reportData = {
			meta: {
				analysisName,
				analysisDate,
				orderedElements: elementOrder
			},
			samples: runlist
		}

		goto("/report")
	}
</script>

<div class="w-fit mx-auto flex flex-col gap-2">
	<div
		class="flex flex-col gap-1 w-full border-2 border-sky-600 border-dashed rounded cursor-pointer bg-sky-200 hover:bg-sky-100"
	>
		<div class="flex items-center justify-center gap-2 pt-3 px-9">
			<IconFileUpload class="w-6 h-6 text-sky-700" />
			<label for="dropzone-file" class="text-sky-700 font-semibold text-md">
				Select exported file
			</label>
			<input
				id="dropzone-file"
				type="file"
				class="hidden"
				bind:files
				on:change={() => parseInput(files)}
			/>
		</div>

		<div class="mx-auto italic text-xs text-sky-600 mb-3">Click here or drag-and-drop file</div>
	</div>

	{#if errorMessage}
		<div
			transition:fade={{ duration: 200 }}
			class="text-red-600 text-sm mx-auto rounded italic whitespace-nowrap"
		>
			{errorMessage ?? ""}
		</div>
	{/if}
</div>
