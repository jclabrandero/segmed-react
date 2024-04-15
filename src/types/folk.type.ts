
import { EmployeePosition, EmployeeType, MedicalOffice, PersonDocumentType } from '.'


export type Person = {
	id:			number
	firstName:	string
	lastName:	string
	sex:		string
	birthDate:	number

	documentNumber:	string
	personDocumentType:	PersonDocumentType

	status:		number
}

export type Clerk = {
	id:		number
	ein:	number

	person:			Person
	position:		EmployeePosition
	employeeType:	EmployeeType
	medicalOffices:	Array<MedicalOffice>

	status:	number
}
