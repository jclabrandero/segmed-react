
import { gql } from '@apollo/client'


export const query = {
	PERSON_DOCUMENT_TYPES: gql`
		query personDocumentTypes {
			personDocumentTypes {
				id name description status
			}
		}
	`,
	PERSON_DOCUMENT_TYPE: gql`
		query personDocumentType($id: Int!) {
			personDocumentType(id: $id) {
				id name description status
			}
		}
	`
}

export const mutation = {
	CREATE_PERSON_DOCUMENT_TYPE: gql`
		mutation create($data: IPersonDocumentTypeCreateArgs!) {
			personDocumentType: createPersonDocumentType(data: $data) {
				id
			}
		}
	`,
	UPDATE_PERSON_DOCUMENT_TYPE: gql`
		mutation update($id: Int!, $data: IPersonDocumentTypeUpdateArgs!) {
			personDocumentType: updatePersonDocumentType(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_PERSON_DOCUMENT_TYPE: gql`
		mutation delete($id: Int!) {
			personDocumentType: deletePersonDocumentType(id: $id) {
				id
			}
		}
	`,
}

export const subscription = {
	PERSON_DOCUMENT_TYPE_UPSERTED: gql`
		subscription upserted {
			personDocumentTypeUpserted {
				id
			}
		}
	`
}
