
import { FileInfo, Medication, Pharmacy } from '.'



export type ClinicCarePrimary = {
	id:				number
	reason?:		string
	physicalExam?:	string
	diagnosis?:		string
}

export type Interclinical = {
	id:				number
	remark:			string
	driftDate:		Date
	approvedState:	number

	files:	Array<FileInfo>
}

export type Prescription = {
	id:				number
	quantity:		number
	indications:	string

	medication:		Medication
	pharmacy:		Pharmacy
}

export type PrescriptionExtern = {
	id:				number
	quantity:		number
	indications:	string
	
	medication:		Medication
}

export type ClinicCareId = { clinicCareId: number }