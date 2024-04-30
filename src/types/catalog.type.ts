
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

export type MedicalSpecialty = {
	id:				number
	name:			string
	description?:	string

	status:			number

	subspecialties: Array<MedicalSubspecialty>
}

export type MedicalGroup = {
	id:				number
	name:			string
	description?:	string

	status:			number

	specialties: Array<MedicalSpecialty>
}

export type DrugClass = {
	id:				number
	name:			string
	description?:	string
	
	status:			number
}

export type DrugUnit = {
	id:				number
	name:			string
	description?:	string
	
	status:			number
}

export type ClinicalCareState = {
	id:				number
	name:			string
	description?:	string
	color:			string
	lock:			boolean

	status:			number
}
