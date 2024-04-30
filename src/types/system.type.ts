
export type FileInfo = {
	id:			number
	md5:		string
	name:		string
	type:		string
	extension:	string

	size:		number
	thumbnail:	string
}

export type FileBase64 = {
	info:	FileInfo
	data:	string
}
