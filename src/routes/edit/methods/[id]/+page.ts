import { getElementList, getElementsByMethod, getLoqsByMethodId, getMethodById } from '$lib/methods';
import type { MethodsResponse } from '$lib/pocketbase-types';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getallReferenceMaterials, getMethodReferenceMaterialsByMethodId } from '$lib/referenceMaterials';


export const load = (async ({ params }) => {
    const methodId = params.id;
    let method: MethodsResponse | null = null;
    try {
        method = await getMethodById(methodId);
    } catch (err) {
        const error = err as Error;
        console.log(error.message);
    }
    if (!method) {
        throw redirect(302, '/edit/methods');
    }


    const { allElementsList } = await getElementsByMethod(method.id);

    const allReferenceMaterials = await getallReferenceMaterials();
    const methodReferenceMaterials = await getMethodReferenceMaterialsByMethodId(method.id);

    const methodReferenceMaterialsList: ReferenceMaterial[] = allReferenceMaterials.map(rm => {
        const thisReferenceMaterial = methodReferenceMaterials.find(mrm => mrm.referenceMaterial === rm.id);
        return {
            id: rm.id,
            name: rm.name,
            active: !!thisReferenceMaterial?.active,
        };
    });


    const loqList = await getLoqsByMethodId(method.id);

    const elementList = await getElementList();

    const methodElements: MethodElement[] = elementList.map(e => {
        const inDbElement = allElementsList.find(anElement => anElement.element === e.id);

        const activeElements = allElementsList.filter(element => element.active);
        const activeElement = activeElements.find(active => active.element === e.id);
        return {
            id: inDbElement?.id ?? Math.random().toString(),
            symbol: e.symbol,
            mass: e.mass,
            active: !!activeElement?.active,
            inDb: !!inDbElement,
            elementId: e.id,
            units: inDbElement?.units ?? 'ppb',
            checkStd: inDbElement?.checkStandard
        }
    })
    methodElements.sort((a, b) => a.active < b.active ? 1 : -1);

    const loqArray: DetectionLimit[] = elementList.map(e => {
        const loq = loqList.find(loq => loq.element === e.id);

        const activeElements = methodElements.filter(me => me.active);
        const visible = !!activeElements.find(me => me.elementId === e.id);

        return {
            id: loq?.id ?? Math.random().toString(),
            symbol: e.symbol,
            mass: e.mass,
            inDb: !!loq,
            value: loq && loq?.value && loq.value > 0 ? loq?.value : undefined,
            visible,
            elementId: e.id,
            methodId: method?.id ?? Math.random().toString()
        }
    })



    return {
        title: `${method.name}${method.description ? `: ${method.description}` : ''}`,
        method,
        loqArray,
        loqList,
        methodElements,
        methodReferenceMaterialsList
    };
}) satisfies PageLoad;