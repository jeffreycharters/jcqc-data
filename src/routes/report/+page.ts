import type { PageLoad } from "./$types"
import type { RunListEntry, Runlist } from "../../app"
import { browser } from "$app/environment"
import { redirect } from "@sveltejs/kit"
import { db, type Instrument, type Method } from "$lib/db"

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
	if (!browser) return { title: "ha ha stupid" }

	const storedRunlist = localStorage.getItem("reportData")
	const storedMethod = localStorage.getItem("fullMethod")
	const storedInstrument = localStorage.getItem("instrument")

	if (!storedRunlist || !storedMethod || !storedInstrument) redirect(302, "/")

	const instrument = JSON.parse(storedInstrument) as Instrument
	const method = JSON.parse(storedMethod) as Method
	const runlist = JSON.parse(storedRunlist) as Runlist
	const { samples } = runlist

	const usedElements = method.elements?.map((e) => e.id) ?? []
	const methodElements = await db.methodElements.where("element").anyOf(usedElements).toArray()

	const title = `${method.name} report`

	if (!runlist) return { title }

	let sampleList: Block[] = []
	let currentBlock: RunListEntry[] = []

	for (let i = 0; i < runlist.samples.length; i++) {
		if (i === samples.length - 1 && samples[i].isSample && !samples[i].duplicateSamples) {
			currentBlock = [...currentBlock, samples[i]]
			sampleList = [...sampleList, { type: "sampleBlock", samples: currentBlock }]
			continue
		}

		if (samples[i].isSample && !samples[i].duplicateSamples) {
			currentBlock = [...currentBlock, samples[i]]
			continue
		}

		if (currentBlock.length != 0) {
			sampleList = [...sampleList, { type: "sampleBlock", samples: currentBlock }]
			currentBlock = []
		}

		sampleList = [...sampleList, { type: "qc", sample: samples[i] }]
	}

	return {
		methodElements,
		runlist,
		title,
		instrument,
		method,
		sampleList
	}
}) satisfies PageLoad
