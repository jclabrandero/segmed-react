
import { User, Group, Permission } from './authorization.type'
import {
	PersonDocumentType,
	EmployeePosition, EmployeeType,
	InsuredType,
	MedicalSubspecialty, MedicalSpecialty, MedicalGroup,
	DrugClass, DrugUnit,
	ClinicalCareState, DisabilityType
} from './catalog.type'
import { Belonging, MedicalOffice, Provider } from './reference.type'
import { Person, Clerk, Insured } from './folk.type'
import { Medication, MedicationStock, Pharmacy, Batch, Inventory, Arrival, ArrivalItem, Departure, DepartureItem } from './drugstore.type'
import {
	ClinicCarePrimary,
	Interclinical,
	Prescription,
	PrescriptionExtern,
	ClinicCareId,
	MedicalLeave
} from './health.type'
import { FileInfo, FileBase64 } from './system.type'


type UpdateProps = {
	id: number
}

export type {
	UpdateProps,
	User, Group, Permission,
	
	PersonDocumentType,
	EmployeePosition, EmployeeType,
	InsuredType,
	MedicalSubspecialty, MedicalSpecialty, MedicalGroup,
	DrugClass, DrugUnit,
	ClinicalCareState, DisabilityType,

	Belonging, MedicalOffice, Provider,

	Person, Clerk, Insured,

	Medication, MedicationStock, Pharmacy, Batch, Inventory, Arrival, ArrivalItem, Departure, DepartureItem,

	ClinicCarePrimary,
	Interclinical,
	Prescription,
	PrescriptionExtern,
	ClinicCareId,
	MedicalLeave,

	FileInfo, FileBase64
}
