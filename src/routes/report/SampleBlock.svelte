<script>
	import HeaderRow from "./HeaderRow.svelte"
</script>

<table class="results samples">
	<HeaderRow firstColumnLabel="Sample Name" />
	<tbody>
		<slot />
	</tbody>
</table>
