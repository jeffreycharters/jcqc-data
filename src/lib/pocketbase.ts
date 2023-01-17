import PocketBase, { Admin, Record } from 'pocketbase';
import { writable, type Writable } from 'svelte/store';

export const pb = new PocketBase('http://127.0.0.1:8090');
pb.autoCancellation(false);
export const currentUser: Writable<Record | Admin | null> = writable(pb.authStore.model);

export const logout = () => {
    pb.authStore.clear();
    currentUser.set(null);
}

pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth);
    currentUser.set(pb.authStore.model);
});