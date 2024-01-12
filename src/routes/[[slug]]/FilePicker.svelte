<script lang="ts">
	import { goto } from "$app/navigation"
	import { countElements, flattenAnalytes, parseCSV, parseRun } from "$lib/data"
	import { reportData } from "$lib/stores"
	import { IconFileUpload } from "@tabler/icons-svelte"

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
		console.log(rawRunlist)

		$reportData = {
			meta: {
				analysisName,
				analysisDate,
				elementCount
			},
			samples: runlist
		}

		goto("/report")
	}
</script>

<div class="w-fit mx-auto flex gap-4">
	<label
		for="dropzone-file"
		class="flex items-center justify-center gap-2 py-3 px-7 w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
	>
		<IconFileUpload class="w-6 h-6 text-gray-500" />
		<p class="text-gray-500 font-semibold text-md">Select exported file</p>
		<input
			id="dropzone-file"
			type="file"
			class="hidden"
			bind:files
			on:change={() => parseInput(files)}
		/>
	</label>

	<div class="text-red-600 mt-2 rounded italic whitespace-nowrap">
		{errorMessage ?? ""}
	</div>
</div>
