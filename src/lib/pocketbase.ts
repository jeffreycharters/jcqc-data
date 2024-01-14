import { dev } from "$app/environment"
import PocketBase from "pocketbase"
import { writable } from "svelte/store"

const HOST = dev ? "http://127.0.0.1:8090" : "http://0.0.0.0:8090"

export const pb = new PocketBase(HOST)
pb.autoCancellation(false)

export const currentUser = writable(pb.authStore.model)

export const logout = () => {
	pb.authStore.clear()
	currentUser.set(null)
}

pb.authStore.onChange((/* auth */) => {
	// console.log('authStore changed', auth);
	currentUser.set(pb.authStore.model)
})
