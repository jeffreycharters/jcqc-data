import { Method } from '$lib/classes';
import { getMethodBySlug } from '$lib/methods';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';


export const load = (async ({ params }) => {
    const slug = params.slug;
    const methodResponse = await getMethodBySlug(slug);
    if (!methodResponse) {
        throw redirect(302, '/edit');
    }
    const method = new Method(methodResponse.id);
    await method.init();



    // const { allElementsList } = await getElementsByMethod(method.id);

    // const allReferenceMaterials = await getallReferenceMaterials();
    // const methodReferenceMaterials = await getMethodReferenceMaterialsByMethodId(method.id);

    // const methodReferenceMaterialsList: BasicReferenceMaterial[] = allReferenceMaterials.map(rm => {
    //     const thisReferenceMaterial = methodReferenceMaterials.find(mrm => mrm.referenceMaterial === rm.id);
    //     return {
    //         id: rm.id,
    //         name: rm.name,
    //         active: !!thisReferenceMaterial?.active,
    //     };
    // });


    // const loqList = await getLoqsByMethodId(method.id);

    // const elementList = await getElementList();

    // const methodElements: MethodElement[] = elementList.map(e => {
    //     const inDbElement = allElementsList.find(anElement => anElement.element === e.id);

    //     const activeElements = allElementsList.filter(element => element.active);
    //     const activeElement = activeElements.find(active => active.element === e.id);
    //     return {
    //         id: inDbElement?.id ?? Math.random().toString(),
    //         symbol: e.symbol,
    //         mass: e.mass,
    //         active: !!activeElement?.active,
    //         inDb: !!inDbElement,
    //         elementId: e.id,
    //         units: inDbElement?.units ?? 'ppb',
    //         checkStd: inDbElement?.checkStandard
    //     }
    // })

    // methodElements.sort((a, b) => a.mass < b.mass ? 1 : -1);
    // methodElements.sort((a, b) => a.active < b.active ? -1 : 1);

    // const loqArray: DetectionLimit[] = elementList.map(e => {
    //     const loq = loqList.find(loq => loq.element === e.id);

    //     const activeElements = methodElements.filter(me => me.active);
    //     const currentMethodElement = activeElements.find(me => me.elementId === e.id);

    //     return {
    //         id: loq?.id ?? Math.random().toString(),
    //         symbol: e.symbol,
    //         mass: e.mass,
    //         inDb: !!loq,
    //         value: loq && loq?.loq && loq.loq > 0 ? loq?.loq : undefined,
    //         units: currentMethodElement?.units ?? 'ppm',
    //         visible: !!currentMethodElement,
    //         elementId: e.id,
    //         methodId: method?.id ?? Math.random().toString()
    //     }
    // })



    return {
        title: `${method.name}${method.description ? `: ${method.description}` : ''}`,
        method,
        // loqArray,
        // loqList,
        // methodElements,
        // methodReferenceMaterialsList
    };
}) satisfies PageLoad;