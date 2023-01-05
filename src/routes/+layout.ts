import { pb } from "$lib/pocketbase";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const prerender = true;

export const load: LayoutLoad = async ({ url }) => {
    const atLoginPage = url.pathname.includes('/login');
    const userLoggedIn = !!pb.authStore.model;

    if (!atLoginPage && !userLoggedIn) throw redirect(302, '/login')
    return {}
}