module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"plugin:svelte/recommended"
	],
	plugins: ["@typescript-eslint"],
	ignorePatterns: ["*.cjs"],
	overrides: [{ files: ["*.svelte"], processor: "svelte-eslint-parser" }],
	settings: {
		"svelte3/typescript": () => require("typescript")
	},
	rules: {
		"sort-imports": ["error", {}]
	},
	overrides: [
		{
			files: ["*.svelte"],
			parser: "svelte-eslint-parser",
			// Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
			parserOptions: {
				parser: "@typescript-eslint/parser"
			}
		}
		// ...
	],
	env: {
		browser: true,
		es2017: true,
		node: true
	}
}
