import { writable, type Writable } from "svelte/store";
import type { MethodsResponse, ReferenceMaterialsResponse } from "./pocketbase-types";
import type { Method } from "./classes";

export const methods: Writable<MethodsResponse[]> = writable([]);

export const method: Writable<Method | null> = writable()

export const showAddForm: Writable<boolean> = writable(false);

export const instrument: Writable<Instrument> = writable();

export const referenceMaterials: Writable<ReferenceMaterialsResponse[]> = writable([]);

export const reportData: Writable<RunListEntry[]> = writable();