/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Elements = "elements",
	Methods = "methods",
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
	expand?: { [key: string]: unknown }
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

export type MethodsRecord = {
	name?: string
}

export type UsersRecord = {
	name?: string
	avatar?: string
}

// Response types include system fields and match responses from the PocketBase API
export type ElementsResponse = ElementsRecord & BaseSystemFields
export type MethodsResponse = MethodsRecord & BaseSystemFields
export type UsersResponse = UsersRecord & AuthSystemFields

export type CollectionRecords = {
	elements: ElementsRecord
	methods: MethodsRecord
	users: UsersRecord
}