
import { DrugClass, DrugUnit, Belonging } from '.'

export type Medication = {
	id:				number
	code:			string
	name:			string
	concentration:	string
	liname:			boolean

	status:	number

	class:	DrugClass
	unit:	DrugUnit
}

type Inventory = {
	id:			number
	lot:		string
	quantity:	number
	expireAt:	Date

	status:	number

	pharmacy:	Pharmacy
	medication:	Medication
}

export type Pharmacy = {
	id:		number
	name:	string

	status:	number

	belonging:	Belonging
	inventory:	Array<Inventory>
}

export type MedicationStock = {
	total:		number
	pharmacy:	Pharmacy
	medication:	Medication
}
