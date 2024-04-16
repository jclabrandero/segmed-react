
import {
	PersonDocumentType,
	EmployeePosition, EmployeeType,
	InsuredType,
	Belonging, MedicalOffice
} from '.'


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

export type Insured = {
	id:				number
	code:			string
	iin?:			number
	inletDate:		Date
	outletDate?:	Date
	tradeUnion:		boolean
	address?:		string
	phone?:			string

	status:			number

	person:			Person
	insuredType:	InsuredType

	holderInsured?:	Insured
	dependents:		Array<Insured>
	belonging:		Belonging
}
