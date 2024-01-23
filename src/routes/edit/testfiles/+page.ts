import { setMethods } from "$lib/methods"
import type { PageLoad } from "./$types"

export const load: PageLoad = (async () => {
	await setMethods()

	return {
		title: `Generate test files`
	}
}) satisfies PageLoad
