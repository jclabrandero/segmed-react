
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
