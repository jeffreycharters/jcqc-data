import { browser } from '$app/environment';
import { pb } from '$lib/pocketbase';
import type { ElementsResponse, MethodElementsResponse, MethodReferenceMaterialsResponse, MethodsResponse, ReferenceMaterialsResponse } from '$lib/pocketbase-types';
import type { PageLoad } from './$types';

interface ElementLimits {
  element: ElementsResponse;
  methodReferenceMaterialId: string | undefined;
  lowerBound: number | undefined;
  upperBound: number | undefined;
}

export const load = (async ({ params }) => {
  const { id, rmId } = params
  const method: MethodsResponse = await pb.collection('methods').getOne(id);
  const methodElements: MethodElementsResponse[] = await pb.collection('methodElements').getFullList(200, { filter: `method = "${method.id}"`, expand: 'element' });

  const referenceMaterial: ReferenceMaterialsResponse = await pb.collection('referenceMaterials').getOne(rmId);
  const currentReferenceMaterialElements: MethodReferenceMaterialsResponse[] = await pb.collection('methodReferenceMaterials').getFullList(200, { filter: `methodId = "${id}"` });
  const newReferenceMaterial = currentReferenceMaterialElements.length === 0;

  const limitsArray: ElementLimits[] = [];
  if (browser) {
    methodElements.forEach(async e => {
      const currentValues = currentReferenceMaterialElements.find(c => c.elementId === e.element);

      limitsArray.push({
        element: e?.expand?.element,
        methodReferenceMaterialId: currentValues?.id ?? undefined,
        lowerBound: currentValues?.lowerBound === 0 ? undefined : currentValues?.lowerBound,
        upperBound: currentValues?.upperBound === 0 ? undefined : currentValues?.upperBound,
      });
    });
  }

  if (limitsArray.length > 0) {
    limitsArray.sort((a, b) => a.element.mass < b.element.mass ? -1 : 1);
  }

  return {
    title: "Editing reference material",
    method, referenceMaterial,
    newReferenceMaterial,
    limitsArray,
  };
}) satisfies PageLoad;