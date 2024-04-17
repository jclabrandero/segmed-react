
export type EmployeePosition = {
	id:				number
	name:			string
	description?:	string
	
	status:			number
}

export type EmployeeType = {
	id:				number
	name:			string
	description?:	string
	
	status:			number
}

export type PersonDocumentType = {
	id:				number
	name:			string
	description?:	string
	
	status:			number
}

export type InsuredType = {
	id:				number
	name:			string
	description?:	string
	withDependents:	boolean
	
	status:			number
}

export type MedicalSubspecialty = {
	id:		number
	name:	string

	description?:		string
	ageRangePatients?:	string

	dt?:	string
	si?:	string
	ot?:	string

	status:			number
}
