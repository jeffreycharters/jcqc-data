import { browser } from "$app/environment";
import { pb } from "$lib/pocketbase";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const prerender = true;

export const load: LayoutLoad = async ({ url }) => {
    const reqPath = url.pathname;
    const loginRequired = reqPath.includes('/edit');
    const userLoggedIn = !!pb.authStore.model;

    if (browser && loginRequired && !userLoggedIn) {
        throw redirect(302, `/login?next=${reqPath}`);
    }
    return {}
}