import { getLoqsByMethodId, getMethodById } from "./methods";
import { pb } from "./pocketbase"
import type { MethodElementsResponse } from "./pocketbase-types"
import { getExpandedReferenceMaterialElementsByMethodId } from "./referenceMaterials";

interface MethodElements {
    id: string;
    name: string;
    symbol: string;
    mass: number;
    units: string;
    checkStandard?: number;
}

export const generateMethodParams = async (methodId: string) => {
    const method = await getMethodById(methodId);
    const elementList: MethodElements[] = await getMethodElements(methodId);
    const loqList = await getMethodLoqs(methodId);
    const referenceMaterials = await getMethodReferenceMaterials(methodId);

    const referenceMaterialNames = Object.keys(referenceMaterials).sort();

    const methodParams = {
        method,
        elements: elementList,
        loqs: loqList,
        referenceMaterials,
        referenceMaterialNames
    }
    return methodParams;
}


const getMethodElements = async (methodId: string) => {
    const params = { filter: `method = "${methodId}" && active = true`, expand: 'element' }
    const currentMethodElements: MethodElementsResponse[] = await pb.collection('methodElements').getFullList(undefined, params);
    const elementList = currentMethodElements.map(me => {
        if (!me.expand?.element) return;
        const element = me.expand.element;
        return {
            id: element.id,
            name: element.name,
            symbol: element.symbol,
            mass: element.mass,
            units: me.units,
            checkStandard: me.checkStandard
        }
    });
    return elementList as MethodElements[];
}

const getMethodLoqs = async (methodId: string) => {
    const loqArray = await getLoqsByMethodId(methodId);
    const loqs: Record<string, number | undefined> = {};

    loqArray.forEach(loq => {
        loqs[loq.expand?.element.symbol] = loq.value
    })
    return loqs
}


interface ReferenceLimits {
    low?: number;
    high?: number;
}

type ElementLimits = Record<string, ReferenceLimits>; // eg. Mn: { low..}

type ReferenceMaterial = Record<string, ElementLimits>; //  eg. Bovine Liver: { Mn ..}

const getMethodReferenceMaterials = async (methodId: string) => {
    const rmElements = await getExpandedReferenceMaterialElementsByMethodId(methodId);
    const referenceMaterials: ReferenceMaterial = {}

    rmElements.forEach(rm => {
        const name = rm.expand?.methodReferenceMaterial.expand?.referenceMaterial.name;
        const element: string = rm.expand?.element.symbol;

        if (!referenceMaterials[name]) referenceMaterials[name] = {};
        if (!referenceMaterials[name][element]) referenceMaterials[name][element] = {};

        referenceMaterials[name][element] = {
            low: rm.lowerBound,
            high: rm.upperBound
        }
    });
    return referenceMaterials;
}