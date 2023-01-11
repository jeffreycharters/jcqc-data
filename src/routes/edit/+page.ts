import { getMethodList } from '$lib/methods';
import type { PageLoad } from './$types';

export const load = (async () => {
  const methodList = await getMethodList('name');
  return {
    title: "Edit Data Processing parameters",
    methodList
  };
}) satisfies PageLoad;


