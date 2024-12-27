
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

export type Inventory = {
	id:		number
	stock:	number
	min:	number

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

export type Batch = {
	id:			number
	code:		string
	expireAt:	Date

	status:	number

	medication:	Medication
}

export type Arrival = {
	id:				number
	remark:			string
	arrivalDate:	Date

	status:	number
}

export type ArrivalItem = {
	id:			number
	quantity:	number
	price:		number

	status:	number

	batch:		Batch
}

export type Departure = {
	id:				number
	remark:			string
	departureDate:	Date

	status:	number
}

export type DepartureItem = {
	id:			number
	quantity:	number
	price:		number

	status:	number

	batch:		Batch
}
