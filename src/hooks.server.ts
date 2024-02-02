// import { pb } from '$lib/pocketbase';

// export async function handle({ event, resolve }) {
// export async function handle() {
// // load the store data from the request cookie string
// pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
// try {
// 	// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
// 	pb.authStore.isValid && (await pb.collection('users').authRefresh());
// } catch (_) {
// 	// clear the auth store on failed refresh
// 	pb.authStore.clear();
// }
// const response = await resolve(event);
// // send back the default 'pb_auth' cookie to the client with the latest store state
// response.headers.append('set-cookie', pb.authStore.exportToCookie());
// return response;
// }
