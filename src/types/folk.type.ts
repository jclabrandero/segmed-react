
import { PersonDocumentType } from '.'


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
