/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Blanks = "blanks",
	DetectionLimits = "detectionLimits",
	Elements = "elements",
	Methods = "methods",
	ReferenceMaterialRanges = "referenceMaterialRanges",
	ReferenceMaterials = "referenceMaterials",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string

// System fields
export type BaseSystemFields = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: { [key: string]: any }
}

export type AuthSystemFields = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields

// Record types for each collection

export type BlanksRecord = {
	name: string
	detectionLimits?: RecordIdString
}

export type DetectionLimitsRecord = {
	mdl?: number
	loq?: string
	element: RecordIdString
}

export type ElementsRecord = {
	name: string
	symbol: string
	mass: number
	active?: boolean
}

export type MethodsRecord = {
	name: string
	rpdLimit?: number
	active?: boolean
	calibrationCount?: number
	description?: string
	checkStandardName?: string
	elements?: RecordIdString
	blanks?: RecordIdString
	referenceMaterials?: RecordIdString
	slug: string
	field?: string
	checkStandardTolerance?: number
}

export type ReferenceMaterialRangesRecord = {
	lower?: number
	upper?: number
	element: RecordIdString
	method: RecordIdString
}

export type ReferenceMaterialsRecord = {
	name: string
	active?: boolean
}

export type UsersRecord = {
	name?: string
	avatar?: string
}

// Response types include system fields and match responses from the PocketBase API
export type BlanksResponse = BlanksRecord & BaseSystemFields
export type DetectionLimitsResponse = DetectionLimitsRecord & BaseSystemFields
export type ElementsResponse = ElementsRecord & BaseSystemFields
export type MethodsResponse = MethodsRecord & BaseSystemFields
export type ReferenceMaterialRangesResponse = ReferenceMaterialRangesRecord & BaseSystemFields
export type ReferenceMaterialsResponse = ReferenceMaterialsRecord & BaseSystemFields
export type UsersResponse = UsersRecord & AuthSystemFields

export type CollectionRecords = {
	blanks: BlanksRecord
	detectionLimits: DetectionLimitsRecord
	elements: ElementsRecord
	methods: MethodsRecord
	referenceMaterialRanges: ReferenceMaterialRangesRecord
	referenceMaterials: ReferenceMaterialsRecord
	users: UsersRecord
}