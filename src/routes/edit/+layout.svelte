<script lang="ts">
	import { page } from "$app/stores"

	const menuLinks = [
		{ text: "JCQC Main", href: "/" },
		{ text: "Edit Methods", href: "/edit" },
		{ text: "Admin Area", href: "/_" }
	]
</script>

<div class="flex gap-12 w-full px-4" data-sveltekit-preload-data="off">
	<ul class="flex flex-col gap-2 relative top-12 w-48">
		{#each menuLinks as link}
			<a
				class="no-underline basic-border py-1 px-2"
				class:hidden={$page.url.pathname === link.href}
				href={link.href}
			>
				<li>
					{link.text}
				</li>
			</a>
		{/each}
	</ul>

	<div>
		<slot />
	</div>
</div>
