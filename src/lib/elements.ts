import { pb } from "./pocketbase"
import type { ElementsResponse } from "./pocketbase-types"

export const getElementList = async () => {
    const elementList: ElementsResponse[] = await pb.collection('elements').getFullList(undefined, { sort: 'mass' });
    return elementList;
}