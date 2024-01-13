import { methodStore, reportData } from "$lib/stores"
import { get } from "svelte/store"
import type { PageLoad } from "./$types"
import type { RunListEntry } from "../../app"

type Block = QC | SampleBlock

type QC = {
	type: "qc"
	sample: RunListEntry
}

type SampleBlock = {
	type: "sampleBlock"
	samples: RunListEntry[]
}

export const load = (async () => {
	const runlist = get(reportData)?.samples

	const title = `${get(methodStore)?.name} report`

	if (!runlist) return { title }

	let sampleList: Block[] = []
	let currentBlock: RunListEntry[] = []

	for (let i = 0; i < runlist.length; i++) {
		if (i === runlist.length - 1 && runlist[i].isSample) {
			currentBlock = [...currentBlock, runlist[i]]
			sampleList = [...sampleList, { type: "sampleBlock", samples: currentBlock }]
			continue
		}

		if (runlist[i].isSample && !runlist[i].duplicateSamples) {
			currentBlock = [...currentBlock, runlist[i]]
			continue
		}

		if (currentBlock.length != 0) {
			sampleList = [...sampleList, { type: "sampleBlock", samples: currentBlock }]
			currentBlock = []
		}

		sampleList = [...sampleList, { type: "qc", sample: runlist[i] }]
	}

	return {
		title,
		sampleList
	}
}) satisfies PageLoad
