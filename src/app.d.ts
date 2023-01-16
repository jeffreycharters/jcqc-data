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
	visible: boolean;
	elementId: string;
	methodId: string;
}

interface MethodElement {
	id: string;
	symbol: string;
	mass: number;
	active: boolean;
	inDb: boolean;
	elementId: string;
	units: string;
	checkStd?: number;
}

interface ReferenceMaterial {
	id: string;
	name: string;
	active: boolean;
}

type Units = "ppb" | "ppm"