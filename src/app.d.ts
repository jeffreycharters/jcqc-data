// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}

}

interface DetectionLimit {
	id?: string;
	symbol: string;
	mass: number;
	value?: number;
	inDb: boolean;
}

interface MethodElement {
	id?: string;
	symbol: string;
	mass: number;
	active: boolean;
	inDb: boolean;
	elementId: string;
}