/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Elements = "elements",
	MethodElements = "methodElements",
	Methods = "methods",
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

export type MethodElementsRecord = {
	method: RecordIdString
	element: RecordIdString
}

export type MethodsRecord = {
	name: string
	rpdLimit?: number
	active?: boolean
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
export type MethodElementsResponse = MethodElementsRecord & BaseSystemFields
export type MethodsResponse = MethodsRecord & BaseSystemFields
export type ReferenceMaterialsResponse = ReferenceMaterialsRecord & BaseSystemFields
export type UsersResponse = UsersRecord & AuthSystemFields

export type CollectionRecords = {
	elements: ElementsRecord
	methodElements: MethodElementsRecord
	methods: MethodsRecord
	referenceMaterials: ReferenceMaterialsRecord
	users: UsersRecord
}