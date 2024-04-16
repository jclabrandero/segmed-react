
import { User, Group, Permission } from './authorization.type'
import {
	PersonDocumentType,
	EmployeePosition, EmployeeType,
	InsuredType
} from './catalog.type'
import { Belonging, MedicalOffice } from './reference.type'
import { Person, Clerk, Insured } from './folk.type'

type UpdateProps = {
	id: number
}

export type {
	UpdateProps,
	User, Group, Permission,
	PersonDocumentType,
	EmployeePosition, EmployeeType,
	InsuredType,
	Belonging, MedicalOffice,
	Person, Clerk, Insured
}
