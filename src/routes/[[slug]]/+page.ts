import { Method } from '$lib/classes';
import { getActiveMethods, getMethodBySlug } from '$lib/methods';
import { pb } from '$lib/pocketbase';
import type { InstrumentsResponse } from '$lib/pocketbase-types';
import { method, instruments } from '$lib/stores';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = (async ({ params }) => {
	const slug = params.slug;
	const methods = await getActiveMethods();

	const instrumentList: InstrumentsResponse[] = await pb.collection('instruments').getFullList();
	instruments.set(instrumentList);

	if (!slug) {
		method.set(null);
		return {
			title: 'JCQC Data Processor',
			methods
		};
	}

	const methodResponse = await getMethodBySlug(slug);
	if (!methodResponse) {
		throw redirect(302, '/');
	}
	const currentMethod = new Method(methodResponse.id);
	await currentMethod.init({
		blanks: true,
		elements: true,
		referenceMaterials: true,
		checkStandards: true
	});
	method.set(currentMethod);

	return {
		title: currentMethod.title,
		methods
	};
}) satisfies PageLoad;
