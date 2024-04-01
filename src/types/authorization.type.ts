
export type User = {
	id:				number
	userName:		string
	displayName?:	string
	email?:			string

	groups:			Array<Group>

	status:			number

	permissions:	Array<string>
	isAuthorized:	boolean
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
