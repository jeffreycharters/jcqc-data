<script lang="ts">
    // @ts-expect-error
	import IconBulb from "@tabler/icons-svelte/dist/svelte/icons/IconBulb.svelte"
</script>

<div class="w-fit max-w-lg border-sky-300 border-2 rounded py-2 px-4 bg-sky-50 text-sky-600">
    <div class="flex gap-2 items-center">
        <IconBulb class="stroke-sky-600 h-6 w-6" />
        <div class="font-bold font-lg">Reminder!</div>
        </div>
        <div>
            <div>
                <p>After editing a method, be sure to export the data and import that file to other computers!</p>
                <p>Visit the <a href="/edit/database" class="text-sky-800 font-semibold underline">database</a> page to export or import.</p>
            </div>
    </div>
</div>

<style lang="postcss">
    p {
        @apply text-sm my-2
    }
</style>