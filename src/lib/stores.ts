import { writable, type Writable } from "svelte/store";
import type { ElementsResponse } from "./pocketbase-types";

export const elements: Writable<ElementsResponse[]> = writable([])