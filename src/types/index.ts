
import { User, Group, Permission } from './authorization.type'
import { PersonDocumentType } from './catalog.type'
import { Person } from './folk.type'

type UpdateProps = {
	id: number
}

export type {
	UpdateProps,
	User, Group, Permission,
	PersonDocumentType,
	Person
}
