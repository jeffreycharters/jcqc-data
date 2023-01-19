<script lang="ts">
	import { goto } from '$app/navigation';
	import { parseCsvToMap } from '$lib/data';
	import { methodData } from '$lib/stores';

	let files: HTMLInputElement['files'];
	let errorMessage: string = '';

	const parseInput = (files: HTMLInputElement['files']) => {
		if (!files || !files[0]) return;
		const inputFile = files[0];

		if (inputFile.type != 'text/plain') {
			errorMessage = 'Incorrect file type';
			return;
		}

		parseCsvToMap(inputFile);
		goto('/report', { invalidateAll: true });
	};

	$: parseInput(files);
</script>

<div class="w-fit mx-auto flex gap-4">
	<label
		for="dropzone-file"
		class="flex items-center justify-center gap-2 py-2 px-6 w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
	>
		<div class="flex items-baseline justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 stroke-gray-500"
				viewBox="0 0 24 24"
				stroke-width="2"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M14 3v4a1 1 0 0 0 1 1h4" />
				<path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
				<path d="M12 11v6" />
				<path d="M9.5 13.5l2.5 -2.5l2.5 2.5" />
			</svg>
		</div>
		<p class="text-gray-500 dark:text-gray-400">
			<span class="font-semibold">Select exported file</span>
		</p>
		<input id="dropzone-file" type="file" class="hidden" bind:files />
	</label>

	<div class="text-red-600 mt-2 rounded italic whitespace-nowrap">
		{errorMessage ?? ''}
	</div>
</div>
