<script lang="ts">
	import TextInput from '$lib/components/TextInput.svelte';
	import { method } from '$lib/stores';
	import BlankList from './BlankList.svelte';
	import CheckStandardList from './CheckStandardList.svelte';

	let newCalName = '';
	let calMessage = '';
	const createNewCheckStandard = async () => {
		if (!newCalName) {
			calMessage = 'Please add a blank name';
			return;
		}
		try {
			await $method.createNewCheckStandard(newCalName);
			$method = $method;
		} catch (err) {
			const error = err as Error;
			calMessage = error.message;
			return;
		}

		newCalName = '';
	};
</script>

<div class="basic-border py-4 px-8 mt-4">
	<h2>Check Standards</h2>

	<div class="flex flex-col gap-4">
		{#if $method.checkStandards && $method.checkStandards?.size > 0}
			{#each Array.from($method.checkStandards).sort() as [_, checkStandard] (checkStandard.id)}
				<CheckStandardList {checkStandard} />
				<!-- TODO: Update this to be a check standard list -->
			{/each}
		{/if}

		<div class="basic-border p-4 w-fit">
			<h3>Add New Check Standard</h3>
			<form class="w-48">
				<TextInput
					label="Check Standard Name"
					placeholder="e.g. Calibration Check"
					name="cal-name"
					bind:value={newCalName}
				/>

				<div class="flex flex-col gap-2 items-start">
					<div class="text-sm text-red-500">{calMessage ?? ''}</div>
					<input
						type="submit"
						value="+Add"
						class="btn font-semibold w-full"
						on:click|preventDefault={createNewCheckStandard}
					/>
					// TODO: Make this collapsible
				</div>
			</form>
		</div>
	</div>
</div>
