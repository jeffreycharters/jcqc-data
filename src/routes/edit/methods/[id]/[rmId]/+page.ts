import { browser } from '$app/environment';
import { getElementsByMethod, getMethodById } from '$lib/methods';
import type { ElementsResponse, ReferenceMaterialElementsResponse } from '$lib/pocketbase-types';
import { activateMethodReferenceMaterial, getCurrentReferenceElements, getMethodReferenceMaterialByMethodAndMaterial, getReferenceMaterialById } from '$lib/referenceMaterials';
import type { PageLoad } from './$types';

interface ElementLimits {
  element: ElementsResponse;
  referenceMaterialElementsId: string | undefined;
  lowerBound: number | undefined;
  upperBound: number | undefined;
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



  let currentReferenceMaterialElements: ReferenceMaterialElementsResponse[];
  if (methodReferenceMaterial) currentReferenceMaterialElements = await getCurrentReferenceElements(methodReferenceMaterial.id);
  else currentReferenceMaterialElements = []


  const { usedElements } = await getElementsByMethod(method.id);
  const methodElements = usedElements;


  const limitsArray: ElementLimits[] = [];
  methodElements.forEach(async e => {
    const currentValues = currentReferenceMaterialElements?.find(c => c.element === e.id);

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