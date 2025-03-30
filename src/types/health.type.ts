
import { DisabilityType, FileInfo, Insured, Medication, Pharmacy } from '.'

export type ClinicCare = {
	id:			number
	startDate:	Date
	endDate:	Date

	insured:	Insured
}

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

	departuredQuantity: number

	medication:		Medication
	pharmacy:		Pharmacy
}

export type PrescriptionExtern = {
	id:				number
	quantity:		number
	indications:	string
	
	medication:		Medication
}

export type MedicalLeave = {
	id:				number
	reason:			string
	startDate:		Date
	endDate:		Date
	
	disabilityType: DisabilityType

	approvalState:	number
}

export type ClinicCareId = { clinicCareId: number }
