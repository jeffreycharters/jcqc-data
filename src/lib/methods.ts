import { pb } from './pocketbase';
import type { MethodsResponse } from './pocketbase-types';

export const getMethodList = async (sort = "name") => {
    const methodList: MethodsResponse[] = await pb.collection('methods').getFullList(undefined, { sort });
    return methodList;
}

export const getActiveMethods = async () => {
    const activeMethods: MethodsResponse[] = await pb.collection('methods').getFullList(200, { filter: 'active = true' });
    return activeMethods;
}


export const getMethodBySlug = async (slug: string) => {
    const method: MethodsResponse = await pb.collection('methods').getFirstListItem(`slug = "${slug}"`);
    return method;
}
