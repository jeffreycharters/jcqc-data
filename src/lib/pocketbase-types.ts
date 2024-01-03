/**
 * This file was @generated using pocketbase-typegen
 */

export enum Collections {
	Blanks = 'blanks',
	CheckStandards = 'checkStandards',
	CheckValues = 'checkValues',
	DetectionLimits = 'detectionLimits',
	Elements = 'elements',
	Instruments = 'instruments',
	Methods = 'methods',
	ReferenceMaterials = 'referenceMaterials',
	ReferenceMaterialsRanges = 'referenceMaterialsRanges',
	Units = 'units',
	Users = 'users'
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;

// System fields
export type BaseSystemFields = {
	id: RecordIdString;
	created: IsoDateString;
	updated: IsoDateString;
	collectionId: string;
	collectionName: Collections;
	expand?: { [key: string]: unknown };
};

export type AuthSystemFields = {
	email: string;
	emailVisibility: boolean;
	username: string;
	verified: boolean;
} & BaseSystemFields;

// Record types for each collection

export type BlanksRecord = {
	name: string;
	detectionLimits?: RecordIdString[];
};

export type CheckStandardsRecord = {
	name: string;
	checkValues?: RecordIdString[];
};

export type CheckValuesRecord = {
	element: RecordIdString;
	value?: number;
};

export type DetectionLimitsRecord = {
	mdl?: number;
	element: RecordIdString;
	loq?: number;
};

export type ElementsRecord = {
	name: string;
	symbol: string;
	mass: number;
	active?: boolean;
};

export type InstrumentsRecord = {
	serial: string;
	name: string;
	softwareVersion: string;
	autosamplerInfo: string;
};

export type MethodsRecord = {
	name: string;
	rpdLimit?: number;
	active?: boolean;
	calibrationCount?: number;
	description?: string;
	elements?: RecordIdString;
	blanks?: RecordIdString;
	referenceMaterials?: RecordIdString;
	slug: string;
	units?: RecordIdString;
	checkStandards?: RecordIdString;
	checkStandardTolerance?: number;
};

export type ReferenceMaterialsRecord = {
	name: string;
	active?: boolean;
	ranges?: RecordIdString[];
};

export type ReferenceMaterialsRangesRecord = {
	lower?: number;
	upper?: number;
	element: RecordIdString;
};

export type UnitsRecord = {
	element: RecordIdString;
	units: string;
};

export type UsersRecord = {
	name?: string;
	avatar?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type BlanksResponse = BlanksRecord & BaseSystemFields;
export type CheckStandardsResponse = CheckStandardsRecord & BaseSystemFields;
export type CheckValuesResponse = CheckValuesRecord & BaseSystemFields;
export type DetectionLimitsResponse = DetectionLimitsRecord & BaseSystemFields;
export type ElementsResponse = ElementsRecord & BaseSystemFields;
export type InstrumentsResponse = InstrumentsRecord & BaseSystemFields;
export type MethodsResponse = MethodsRecord & BaseSystemFields;
export type ReferenceMaterialsResponse = ReferenceMaterialsRecord & BaseSystemFields;
export type ReferenceMaterialsRangesResponse = ReferenceMaterialsRangesRecord & BaseSystemFields;
export type UnitsResponse = UnitsRecord & BaseSystemFields;
export type UsersResponse = UsersRecord & AuthSystemFields;

export type CollectionRecords = {
	blanks: BlanksRecord;
	checkStandards: CheckStandardsRecord;
	checkValues: CheckValuesRecord;
	detectionLimits: DetectionLimitsRecord;
	elements: ElementsRecord;
	instruments: InstrumentsRecord;
	methods: MethodsRecord;
	referenceMaterials: ReferenceMaterialsRecord;
	referenceMaterialsRanges: ReferenceMaterialsRangesRecord;
	units: UnitsRecord;
	users: UsersRecord;
};
