import { writable, type Writable } from "svelte/store";
import type { SubmissionResult } from "./data";
import type { ElementsResponse, MethodsResponse, ReferenceMaterialsResponse } from "./pocketbase-types";

export const elements: Writable<ElementsResponse[]> = writable([]);

export const methods: Writable<MethodsResponse[]> = writable([]);

export const method: Writable<MethodsResponse> = writable()

export const instrument: Writable<Instrument> = writable();

export const methodParams: Writable<MethodParams> = writable();
export const reportData: Writable<{
    name: string;
    results: SubmissionResult;
}[]> = writable();

export const selectedMethodId: Writable<string> = writable('');

export const referenceMaterials: Writable<ReferenceMaterialsResponse[]> = writable([]);

export const loqs: Writable<DetectionLimit[]> = writable([]);

export const showAddForm: Writable<boolean> = writable(false);

export const methodReferenceMaterials: Writable<ReferenceMaterial[]> = writable([]);
