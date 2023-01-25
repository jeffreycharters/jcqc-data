import { getMethodById } from "./methods"
import type { MethodsResponse } from "./pocketbase-types";

export const getBlanksByMethodId = async (methodId: string) => {
    const method: MethodsResponse = await getMethodById(methodId);
    const { blanks } = method;
    return blanks
}

// export const createBlankByMethodId = async (methodId: string) => {

// }