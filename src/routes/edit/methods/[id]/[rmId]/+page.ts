import { browser } from '$app/environment';
import { pb } from '$lib/pocketbase';
import type { ElementsResponse, MethodElementsResponse, MethodReferenceMaterialsResponse, MethodsResponse, ReferenceMaterialElementsResponse, ReferenceMaterialsResponse, } from '$lib/pocketbase-types';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

interface ElementLimits {
  element: ElementsResponse;
  referenceMaterialElementsId: string | undefined;
  lowerBound: number | undefined;
  upperBound: number | undefined;
}

const addReferenceToMethod = async (methodId: string, referenceMaterialId: string) => {
  let methodReferenceMaterial: MethodReferenceMaterialsResponse = await pb.collection('methodReferenceMaterials').create(JSON.stringify({
    method: methodId,
    referenceMaterial: referenceMaterialId,
    expand: 'method, referenceMaterial'
  }));
  return methodReferenceMaterial
}

const getreferenceMaterial = async (methodId: string, rmId: string) => {
  let methodReferenceMaterial: MethodReferenceMaterialsResponse | undefined = undefined;
  try {
    methodReferenceMaterial = await pb.collection('methodReferenceMaterials').getFirstListItem(`method = "${methodId}" && referenceMaterial = "${rmId}"`, { expand: 'method, referenceMaterial' });
  } catch (_) {
    return null;
  }

  return methodReferenceMaterial;
}

const getCurrentReferenceElements = async (methodReferenceMaterialId: string) => {
  let currentReferenceMaterialElements: ReferenceMaterialElementsResponse[];
  try {
    currentReferenceMaterialElements = await pb.collection('referenceMaterialElements').getFullList(200, { filter: `methodReferenceMaterial = "${methodReferenceMaterialId}"` });
  } catch (_) {
    return null
  }
  return currentReferenceMaterialElements;
}

const getMethodElements = async (methodId: string) => {
  const methodElements: MethodElementsResponse[] = await pb.collection('methodElements').getFullList(200, { filter: `method = "${methodId}"`, sort: 'element.mass', expand: 'element' })
  const elements = methodElements.map(e => e?.expand?.element);
  return elements;
}

export const load = (async ({ params }) => {
  if (!browser) return {};

  const { id, rmId } = params;

  let methodReferenceMaterial = await getreferenceMaterial(id, rmId);
  if (!methodReferenceMaterial) methodReferenceMaterial = await addReferenceToMethod(id, rmId);

  if (!methodReferenceMaterial.active) await pb.collection('methodReferenceMaterials').update(methodReferenceMaterial.id, { "active": true })

  const method: MethodsResponse = methodReferenceMaterial?.expand?.method;
  const referenceMaterial: ReferenceMaterialsResponse = methodReferenceMaterial?.expand?.referenceMaterial;
  if (!method || !referenceMaterial) throw redirect(302, '/edit/methods');

  const currentReferenceMaterialElements = await getCurrentReferenceElements(methodReferenceMaterial.id);

  const methodElements: ElementsResponse[] = await getMethodElements(method.id);

  const limitsArray: ElementLimits[] = [];
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
    methodReferenceMaterialId: methodReferenceMaterial.id,
    limitsArray,
  };
}) satisfies PageLoad;