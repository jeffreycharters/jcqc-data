<script lang="ts">
	import { roundToSigFigs, sortedArrayFromMap } from '$lib/data';
	import { methodParams } from '$lib/stores';
	import { element } from 'svelte/internal';
	import HeaderRow from './HeaderRow.svelte';

	export let sample: RunListEntry;
	let values = sortedArrayFromMap(sample.results.values);
	$: checkStandardLimit = $methodParams?.method.checkStandardLimit / 100;
</script>

<div>
	<table class="results">
		<HeaderRow firstColumnLabel="Check Standard" />

		<tbody>
			<tr>
				<td class="firstCol">{sample.name}</td>

				{#each values as [_, value]}
					{@const prettifiedValue = value < 2 ? value * 1000 : value}
					<td class="text-center">
						{roundToSigFigs(prettifiedValue, 3)}
					</td>
				{/each}
			</tr>

			{#if checkStandardLimit}
				<tr>
					<td>Within Range</td>
					{#each values as [key, value]}
						{@const prettifiedValue = value < 1 ? value * 1000 : value}
						{@const elementExpected = $methodParams.elements.find(
							(element) => element.mass === key
						)?.checkStandard}
						{@const tolerance = elementExpected * checkStandardLimit}
						{@const passes =
							prettifiedValue < elementExpected + tolerance &&
							prettifiedValue > elementExpected - tolerance}
						<td class={passes ? 'passes' : 'fails'}>
							{passes ? 'Yes' : 'No'}
						</td>
					{/each}
					<!-- {data.values.map((v, i) => {
            if (v < 1) {
              v = v * 1000;
            }
            const limitLow =
              expectedValues[i] - expectedValues[i] * tolerance;
            const limitHigh =
              expectedValues[i] + expectedValues[i] * tolerance;
            const withinRange = v > limitLow && v < limitHigh;
            return (
              <td
                class={withinRange ? "samplePass" : "sampleFail"}
                key={v + i}
              >
                {" "}
                {withinRange ? "Yes" : "No"}
              </td>
            );
          })} -->
				</tr>
			{/if}
		</tbody>
	</table>
	<br />
</div>
