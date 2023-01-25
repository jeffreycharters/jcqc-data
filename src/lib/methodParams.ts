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

    const referenceMaterialNames = function () {
        const names: string[] = [];
        referenceMaterials.forEach((_, k) => names.push(k))
        return names;
    }()


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
    const params = { filter: `method = "${methodId}" && active = true`, expand: 'element', sort: 'element.mass' }
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
    const loqs: Record<number, number | undefined> = {};

    loqArray.forEach(loq => {
        loqs[loq.expand?.element.mass] = loq.value
    })
    return loqs
}


const getMethodReferenceMaterials = async (methodId: string) => {
    const rmElements = await getExpandedReferenceMaterialElementsByMethodId(methodId);
    const rmMap: ReferenceMaterial = new Map();

    rmElements.forEach(rm => {
        const name = rm.expand?.methodReferenceMaterial.expand?.referenceMaterial.name;
        const element = rm.expand?.element.mass

        if (!rmMap.has(name)) rmMap.set(name, new Map());
        const currentRm = rmMap.get(name);
        if (currentRm && !currentRm.has(element)) currentRm.set(element, {
            low: rm.lowerBound,
            high: rm.upperBound
        });

    });
    return rmMap;
}