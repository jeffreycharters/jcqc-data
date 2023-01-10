/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Elements = "elements",
	Loqs = "loqs",
	MethodElements = "methodElements",
	MethodReferenceMaterials = "methodReferenceMaterials",
	Methods = "methods",
	ReferenceMaterialElements = "referenceMaterialElements",
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

export type ElementsRecord = {
	name: string
	symbol: string
	mass: number
	retired?: boolean
}

export type LoqsRecord = {
	method: RecordIdString
	value?: number
	element: RecordIdString
}

export type MethodElementsRecord = {
	method: RecordIdString
	element: RecordIdString
}

export type MethodReferenceMaterialsRecord = {
	method: RecordIdString
	referenceMaterial: RecordIdString
	active?: boolean
}

export type MethodsRecord = {
	name: string
	rpdLimit?: number
	active?: boolean
	calibrationCount: number
}

export type ReferenceMaterialElementsRecord = {
	methodReferenceMaterial: RecordIdString
	element: RecordIdString
	upperBound?: number
	lowerBound?: number
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
export type ElementsResponse = ElementsRecord & BaseSystemFields
export type LoqsResponse = LoqsRecord & BaseSystemFields
export type MethodElementsResponse = MethodElementsRecord & BaseSystemFields
export type MethodReferenceMaterialsResponse = MethodReferenceMaterialsRecord & BaseSystemFields
export type MethodsResponse = MethodsRecord & BaseSystemFields
export type ReferenceMaterialElementsResponse = ReferenceMaterialElementsRecord & BaseSystemFields
export type ReferenceMaterialsResponse = ReferenceMaterialsRecord & BaseSystemFields
export type UsersResponse = UsersRecord & AuthSystemFields

export type CollectionRecords = {
	elements: ElementsRecord
	loqs: LoqsRecord
	methodElements: MethodElementsRecord
	methodReferenceMaterials: MethodReferenceMaterialsRecord
	methods: MethodsRecord
	referenceMaterialElements: ReferenceMaterialElementsRecord
	referenceMaterials: ReferenceMaterialsRecord
	users: UsersRecord
}