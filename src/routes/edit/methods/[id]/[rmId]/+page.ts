import { browser } from '$app/environment';
import { getMethodById } from '$lib/methods';
import { pb } from '$lib/pocketbase';
import type { ElementsResponse, MethodElementsResponse, MethodReferenceMaterialsResponse, MethodsResponse, ReferenceMaterialElementsResponse, ReferenceMaterialsResponse, } from '$lib/pocketbase-types';
import { activateMethodReferenceMaterial, getCurrentReferenceElements, getMethodReferenceMaterialByMethodAndMaterial, getReferenceMaterialById } from '$lib/referenceMaterials';
import type { PageLoad } from './$types';

interface ElementLimits {
  element: ElementsResponse;
  referenceMaterialElementsId: string | undefined;
  lowerBound: number | undefined;
  upperBound: number | undefined;
}


const getMethodElements = async (methodId: string) => {
  const methodElements: MethodElementsResponse[] = await pb.collection('methodElements').getFullList(200, { filter: `method = "${methodId}"`, sort: 'element.mass', expand: 'element' })
  const elements = methodElements.map(e => e?.expand?.element);
  return elements;
}

export const load = (async ({ params }) => {
  if (!browser) return {};

  const { id, rmId } = params;

  const method = await getMethodById(id);
  const referenceMaterial = await getReferenceMaterialById(rmId);

  let methodReferenceMaterial = await getMethodReferenceMaterialByMethodAndMaterial(method.id, referenceMaterial.id);
  if (methodReferenceMaterial && !methodReferenceMaterial.active) {
    methodReferenceMaterial = await activateMethodReferenceMaterial(methodReferenceMaterial.id);
  }

  const limitsArray: ElementLimits[] = [];


  let currentReferenceMaterialElements: ReferenceMaterialElementsResponse[];
  if (methodReferenceMaterial) currentReferenceMaterialElements = await getCurrentReferenceElements(methodReferenceMaterial.id);
  else currentReferenceMaterialElements = []


  const methodElements: ElementsResponse[] = await getMethodElements(method.id);
  methodElements.forEach(async e => {
    const currentValues = currentReferenceMaterialElements?.find(c => c.elementId === e.id);

    limitsArray.push({
      element: e,
      referenceMaterialElementsId: currentValues?.id ?? undefined,
      lowerBound: currentValues?.lowerBound === 0 ? undefined : currentValues?.lowerBound,
      upperBound: currentValues?.upperBound === 0 ? undefined : currentValues?.upperBound,
    });
  });




  if (limitsArray.length > 0) {
    limitsArray.sort((a, b) => a.element.mass < b.element.mass ? -1 : 1);
  }

  return {
    title: "Editing reference material",
    method, referenceMaterial,
    methodReferenceMaterialId: methodReferenceMaterial?.id ?? null,
    limitsArray,
  };
}) satisfies PageLoad;