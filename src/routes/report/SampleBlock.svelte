<script>
	import HeaderRow from './HeaderRow.svelte';
</script>

<table class="results mb-4">
	<HeaderRow firstColumnLabel="Sample Name" />
	<tbody>
		<slot />
	</tbody>
</table>
