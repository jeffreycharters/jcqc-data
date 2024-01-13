<script lang="ts">
	import { page } from "$app/stores"

	const menuLinks = [
		{ text: "JCQC Main", href: "/" },
		{ text: "Edit Methods", href: "/edit" },
		{ text: "Admin Area", href: "/_" }
	]
</script>

<div class="flex gap-12 w-full mx-4" data-sveltekit-preload-data="off">
	<ul class="flex flex-col gap-2 relative top-12 w-48">
		{#each menuLinks as link}
			<li class="basic-border py-1 px-2" class:hidden={$page.url.pathname === link.href}>
				<a class="no-underline" href={link.href}>{link.text}</a>
			</li>
		{/each}
	</ul>
	<div class="w-full">
		<slot />
	</div>
</div>
