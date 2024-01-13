<script>
	import HeaderRow from "./HeaderRow.svelte"
</script>

<table class="results">
	<HeaderRow firstColumnLabel="Sample Name" />
	<tbody>
		<slot />
	</tbody>
</table>
