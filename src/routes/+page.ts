import type { PageLoad } from "./$types"

export const load: PageLoad = (async () => {
	return {
		title: "JCQC Data Processor"
	}
}) satisfies PageLoad
