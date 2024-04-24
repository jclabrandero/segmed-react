import { Clerk } from '.'


export type User = {
	id:				number
	userName:		string
	displayName?:	string
	email?:			string

	status:			number
	isAuthorized:	boolean

	groups:			Array<Group>
	permissions:	Array<string>
	clerk?:			Clerk
}

export type Group = {
	id:				number
	name:			string
	description?:	string

	permissions:	Array<Permission>
	
	status:			number
}

export type Permission = {
	id:				number
	code:			string
	description?:	string
	
	status:			number
}
