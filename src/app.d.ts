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

type ElementLimits = Map<number, ReferenceLimits>; // eg. 55: { low..}

type ReferenceMaterial = Map<string, ElementLimits>; //  eg. Bovine Liver: { Mn ..}

interface BasicReferenceMaterial {
	id: string;
	name: string;
	active: boolean;
}

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

interface ElementResult {
	value: number;
	dupValue?: number;
}

interface SubmissionMeta {
	hasDup: boolean;
}

interface SubmissionResult {
	results: Map<string, ElementResult>;
	meta: SubmissionMeta
}

interface InputLine {
	name: string;
	results: Map<number, number>
}

interface RunListEntry {
	name: string;
	id: string;
	isCalBlank?: boolean;
	isCalCheck?: boolean;
	isMethodBlank?: boolean;
	isReferenceMaterial?: boolean;
	isDup: boolean;
	isSample?: boolean;
	results: {
		values: Map<number, number>,
		dupValues?: Map<number, number>
	};
}
