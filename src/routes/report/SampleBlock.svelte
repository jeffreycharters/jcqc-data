<script>
	import HeaderRow from './HeaderRow.svelte';
</script>

<br />
<table class="results">
	<HeaderRow firstColumnLabel="Sample Name" />
	<tbody>
		<slot />
	</tbody>
</table>
