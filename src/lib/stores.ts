import { writable, type Writable } from "svelte/store";
import type { ElementsResponse, MethodsResponse } from "./pocketbase-types";

export const elements: Writable<ElementsResponse[]> = writable([])

export const methods: Writable<MethodsResponse[]> = writable([])