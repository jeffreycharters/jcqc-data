/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from "pocketbase"
import type { RecordService } from "pocketbase"

export enum Collections {
	Blanks = "blanks",
	CheckStandards = "checkStandards",
	CheckValues = "checkValues",
	DetectionLimits = "detectionLimits",
	Elements = "elements",
	Instruments = "instruments",
	MethodElements = "methodElements",
	Methods = "methods",
	ReferenceMaterials = "referenceMaterials",
	ReferenceMaterialsRanges = "referenceMaterialsRanges",
	Users = "users"
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type BlanksRecord = {
	method: RecordIdString
	name?: string
}

export type CheckStandardsRecord = {
	method: RecordIdString
	name?: string
}

export type CheckValuesRecord = {
	checkStandard: RecordIdString
	element?: RecordIdString
	value?: number
}

export type DetectionLimitsRecord = {
	blank: RecordIdString
	element?: RecordIdString
	loq?: number
	mdl?: number
}

export type ElementsRecord = {
	active?: boolean
	mass: number
	name?: string
	symbol?: string
}

export type InstrumentsRecord = {
	autosamplerInfo?: string
	name?: string
	serial?: string
	softwareVersion?: string
}

export enum MethodElementsUnitsOptions {
	"ppb" = "ppb",
	"ppm" = "ppm"
}
export type MethodElementsRecord = {
	element: RecordIdString
	method: RecordIdString
	units: MethodElementsUnitsOptions
}

export type MethodsRecord = {
	active?: boolean
	calibrationCount?: number
	checkStandardTolerance?: number
	description?: string
	name?: string
	rpdLimit?: number
	slug?: string
}

export type ReferenceMaterialsRecord = {
	active?: boolean
	method: RecordIdString
	name?: string
}

export type ReferenceMaterialsRangesRecord = {
	element?: RecordIdString
	lower?: number
	upper?: number
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type BlanksResponse<Texpand = unknown> = Required<BlanksRecord> & BaseSystemFields<Texpand>
export type CheckStandardsResponse<Texpand = unknown> = Required<CheckStandardsRecord> &
	BaseSystemFields<Texpand>
export type CheckValuesResponse<Texpand = unknown> = Required<CheckValuesRecord> &
	BaseSystemFields<Texpand>
export type DetectionLimitsResponse<Texpand = unknown> = Required<DetectionLimitsRecord> &
	BaseSystemFields<Texpand>
export type ElementsResponse<Texpand = unknown> = Required<ElementsRecord> &
	BaseSystemFields<Texpand>
export type InstrumentsResponse<Texpand = unknown> = Required<InstrumentsRecord> &
	BaseSystemFields<Texpand>
export type MethodElementsResponse<Texpand = unknown> = Required<MethodElementsRecord> &
	BaseSystemFields<Texpand>
export type MethodsResponse<Texpand = unknown> = Required<MethodsRecord> & BaseSystemFields<Texpand>
export type ReferenceMaterialsResponse<Texpand = unknown> = Required<ReferenceMaterialsRecord> &
	BaseSystemFields<Texpand>
export type ReferenceMaterialsRangesResponse<Texpand = unknown> =
	Required<ReferenceMaterialsRangesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	blanks: BlanksRecord
	checkStandards: CheckStandardsRecord
	checkValues: CheckValuesRecord
	detectionLimits: DetectionLimitsRecord
	elements: ElementsRecord
	instruments: InstrumentsRecord
	methodElements: MethodElementsRecord
	methods: MethodsRecord
	referenceMaterials: ReferenceMaterialsRecord
	referenceMaterialsRanges: ReferenceMaterialsRangesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	blanks: BlanksResponse
	checkStandards: CheckStandardsResponse
	checkValues: CheckValuesResponse
	detectionLimits: DetectionLimitsResponse
	elements: ElementsResponse
	instruments: InstrumentsResponse
	methodElements: MethodElementsResponse
	methods: MethodsResponse
	referenceMaterials: ReferenceMaterialsResponse
	referenceMaterialsRanges: ReferenceMaterialsRangesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: "blanks"): RecordService<BlanksResponse>
	collection(idOrName: "checkStandards"): RecordService<CheckStandardsResponse>
	collection(idOrName: "checkValues"): RecordService<CheckValuesResponse>
	collection(idOrName: "detectionLimits"): RecordService<DetectionLimitsResponse>
	collection(idOrName: "elements"): RecordService<ElementsResponse>
	collection(idOrName: "instruments"): RecordService<InstrumentsResponse>
	collection(idOrName: "methodElements"): RecordService<MethodElementsResponse>
	collection(idOrName: "methods"): RecordService<MethodsResponse>
	collection(idOrName: "referenceMaterials"): RecordService<ReferenceMaterialsResponse>
	collection(idOrName: "referenceMaterialsRanges"): RecordService<ReferenceMaterialsRangesResponse>
	collection(idOrName: "users"): RecordService<UsersResponse>
}
