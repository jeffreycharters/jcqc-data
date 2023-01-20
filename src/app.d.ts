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
	units: string;
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

interface ReferenceLimits {
	low?: number;
	high?: number;
}

type ElementLimits = Map<string, ReferenceLimits>; // eg. Mn: { low..}

type ReferenceMaterial = Map<string, ElementLimits>; //  eg. Bovine Liver: { Mn ..}

type Units = "ppb" | "ppm"

interface Instrument {
	serial: string;
	name: string;
	softwareName?: string;
	softwareVersion?: string;
	softwareBuild?: string;
	autosamplerModel?: string;
	autosamplerSerial?: string;
}

interface MethodParams {
	method: MethodsResponse;
	elements: MethodElements[];
	loqs: Record<string, number | undefined>;
	referenceMaterials: ReferenceMaterial;
	referenceMaterialNames: string[];
}
