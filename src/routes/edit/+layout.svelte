<script lang="ts">
	const menuLinks = [
		{ text: 'JCQC Main', href: '/' },
		{ text: 'Edit Methods', href: '/edit' },
		{ text: 'Admin Area', href: '/_' }
	];
</script>

<div class="absolute top-20 left-2" data-sveltekit-preload-data="off">
	<ul class="flex flex-col gap-2">
		{#each menuLinks as link}
			<li class="basic-border py-1 px-2">
				<a class="no-underline" href={link.href}>{link.text}</a>
			</li>
		{/each}
	</ul>
</div>
<div class="py-4 px-8 max-w-screen-xl mx-auto relative">
	<slot />
</div>
