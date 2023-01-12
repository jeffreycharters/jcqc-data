import { writable, type Writable } from "svelte/store";
import type { ElementsResponse, MethodsResponse, ReferenceMaterialsResponse } from "./pocketbase-types";

export const elements: Writable<ElementsResponse[]> = writable([]);

export const methods: Writable<MethodsResponse[]> = writable([]);

export const method: Writable<MethodsResponse> = writable()

export const referenceMaterials: Writable<ReferenceMaterialsResponse[]> = writable([]);

interface LOQItem {
    value: number | undefined;
    existsInDb: boolean;
}

export interface LOQDict {
    [key: string]: LOQItem;
}

export const loqs: Writable<LOQDict> = writable({});

export const removeLoq = (elementId: string) => {
    loqs.update(n => {
        if (n[elementId]) delete n[elementId];
        return n;
    });
}

export const showAddForm: Writable<boolean> = writable(false);