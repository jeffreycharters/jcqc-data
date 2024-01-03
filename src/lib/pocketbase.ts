import PocketBase from 'pocketbase';
import { writable} from 'svelte/store';

export const pb = new PocketBase('http://127.0.0.1:8090');
pb.autoCancellation(false);
export const currentUser = writable(pb.authStore.model);

export const logout = () => {
    pb.authStore.clear();
    currentUser.set(null);
}

pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth);
    currentUser.set(pb.authStore.model);
});