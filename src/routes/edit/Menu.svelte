<script lang="ts">
	import { page } from "$app/stores"

	// @ts-expect-error
	import IconPacman from "@tabler/icons-svelte/dist/svelte/icons/IconPacman.svelte"

	// @ts-expect-error
	import IconBatteryAutomotive from "@tabler/icons-svelte/dist/svelte/icons/IconBatteryAutomotive.svelte"

	// @ts-expect-error
	import IconDatabaseEdit from "@tabler/icons-svelte/dist/svelte/icons/IconDatabaseEdit.svelte"

	// @ts-expect-error
	import IconTestPipe from "@tabler/icons-svelte/dist/svelte/icons/IconTestPipe.svelte"

	// @ts-expect-error
	import IconAtom2 from "@tabler/icons-svelte/dist/svelte/icons/IconAtom2.svelte"

	// @ts-expect-error
	import IconHomeHeart from "@tabler/icons-svelte/dist/svelte/icons/IconHomeHeart.svelte"

	const menuLinks = [
		{ text: "JCQC Main", href: "/", icon: IconHomeHeart, class: "stroke-red-600" },
		{ text: "Edit Elements", href: "/edit/elements", icon: IconAtom2, class: "stroke-lime-600" },
		{ text: "Edit Methods", href: "/edit", icon: IconPacman, class: "stroke-yellow-500" },
		{
			text: "Edit Instruments",
			href: "/edit/instruments",
			icon: IconBatteryAutomotive,
			class: "stroke-cyan-600"
		},
		{
			text: "Generate Test Files",
			href: "/edit/testfiles",
			icon: IconTestPipe,
			class: "stroke-emerald-600"
		},
		{
			text: "Manage Database",
			href: "/edit/database",
			icon: IconDatabaseEdit,
			class: "stroke-fuchsia-600"
		}
	]
</script>

<ul class="relative top-12 flex w-64 flex-col gap-2">
	{#each menuLinks as link}
		<a
			class="basic-border px-2 py-[3px] no-underline"
			class:bg-teal-200={$page.url.pathname === link.href}
			href={link.href}
		>
			<li class="flex items-center gap-2">
				<div class="shadow-inner-lg rounded-full bg-white p-[2px]">
					<svelte:component this={link.icon} class="h-6 w-6 {link.class}" stroke="1.25" />
				</div>
				{link.text}
			</li>
		</a>
	{/each}
</ul>
