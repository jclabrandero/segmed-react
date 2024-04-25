
import { MedicalGroup } from '.'


export type Belonging = {
	id:		number
	name:	string
	
	status:	number
}

export type MedicalOffice = {
	id:			number
	name:		string
	
	status:		number

	belonging:	Belonging
}

export type Provider = {
	id:				number
	vendorCode:		string
	businessName:	string
	nit?:			string
	address?:		string
	phone?:			string

	status:			number

	belonging:		Belonging
	medicalGroups:	Array<MedicalGroup>
}
