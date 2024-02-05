import { preprocessMeltUI, sequence } from "@melt-ui/pp"
import preprocess from "svelte-preprocess"
import adapter from "@sveltejs/adapter-netlify"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([
		vitePreprocess(),
		preprocess({
			postcss: true
		}),
		preprocessMeltUI()
	]),
	kit: {
		adapter: adapter({
			fallback: "index.html"
		})
	}
}
export default config
