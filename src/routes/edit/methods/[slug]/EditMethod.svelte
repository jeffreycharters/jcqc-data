<script lang="ts">
	import NumberInput from '$lib/components/NumberInput.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { method } from '$lib/stores';
	import { fade } from 'svelte/transition';

	let formMessage = '';
	let timer: NodeJS.Timer;

	let open = false;
	let contentDiv: HTMLElement;

	let { name, calibrationCount, description, checkStandardTolerance, rpdLimit } = $method || {};

	const addFormMessage = (message: string, timeout: number = 3000) => {
		if (timer) clearTimeout(timer);
		formMessage = message;
		timer = setTimeout(() => (formMessage = ''), timeout);
	};

	const editMethod = async () => {
		if (!$method?.name || !$method?.calibrationCount) {
			addFormMessage('Missing something');
			return;
		}
		try {
			$method?.updateProperties({
				name,
				calibrationCount,
				description,
				checkStandardTolerance,
				rpdLimit
			});
			addFormMessage('Saved!');
		} catch (err) {
			const error = err as Error;
			addFormMessage(error.message);
		}
	};

	function debounce(callback: () => void, timeout = 1000) {
		return (...args: any) => {
			addFormMessage('Changes pending...');
			clearTimeout(timer);
			timer = setTimeout(() => {
				callback.apply(debounce, args);
			}, timeout);
		};
	}

	const processUpdate = () => debounce(editMethod);
</script>

<div class="basic-border my-4 px-8 py-4 w-full">
	<div class="flex items-end gap-4">
		<button class="flex gap-2 items-center" on:click={() => (open = !open)}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 stroke-gray-400 transition-all {open ? 'rotate-90' : ''}"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M7 7l5 5l-5 5" />
				<path d="M13 7l5 5l-5 5" />
			</svg>
			<h2>Edit Method</h2>
		</button>
		{#if formMessage}
			<div
				class="text-sm text-amber-600 italic tracking-wide w-36 text-center"
				in:fade={{ duration: 200 }}
				out:fade={{ duration: 100 }}
			>
				{formMessage}
			</div>
		{/if}
	</div>

	<div
		class="overflow-hidden transition-all"
		style="max-height: {open ? `${contentDiv.scrollHeight}px` : '0'} "
		bind:this={contentDiv}
	>
		<form on:input={processUpdate()} on:submit|preventDefault>
			<div class="grid grid-cols-2">
				<TextInput
					name="method-name"
					placeholder="e.g. TOXI-064 or Serum Iodine"
					bind:value={name}
					label="Method Name"
				/>
				<TextInput
					name="description"
					placeholder="e.g. Metals in serum"
					bind:value={description}
					label="Method Description"
				/>
				<NumberInput
					name="cal-count"
					label="Number of non-blank calibration standards"
					bind:value={calibrationCount}
					placeholder="e.g. 6"
				/>
				<NumberInput
					name="rpd-limit"
					label="RPD Warning limit (%)"
					bind:value={rpdLimit}
					placeholder="e.g. 15"
				/>
				<NumberInput
					name="check-standard-limit"
					label="Check Standard Tolerance (%)"
					bind:value={checkStandardTolerance}
					placeholder="e.g. 15"
				/>
			</div>
		</form>
	</div>
</div>
