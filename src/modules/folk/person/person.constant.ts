
import { gql } from '@apollo/client'


export const query = {
	PERSONS: gql`
		query persons {
			persons {
				id firstName lastName sex birthDate documentNumber status
				personDocumentType { id name }
			}
		}
	`,
	PERSON: gql`
		query person($id: Int!) {
			person(id: $id) {
				id firstName lastName sex birthDate documentNumber status
				personDocumentType { id name }
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query dependencies {
			personDocumentTypes: activePersonDocumentTypes {
				id name
			}
		}
	`,
	UPDATE_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			person(id: $id) {
				id firstName lastName sex birthDate documentNumber status
				personDocumentType { id name }
			}
			personDocumentTypes: activePersonDocumentTypes {
				id name
			}
		}
	`
}

export const mutation = {
	CREATE_PERSON: gql`
		mutation create($data: IPersonCreateArgs!) {
			person: createPerson(data: $data) {
				id
			}
		}
	`,
	UPDATE_PERSON: gql`
		mutation update($id: Int!, $data: IPersonUpdateArgs!) {
			person: updatePerson(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_PERSON: gql`
		mutation delete($id: Int!) {
			person: deletePerson(id: $id) {
				id
			}
		}
	`
}

export const subscription = {
	PERSON_UPSERTED: gql`
		subscription upserted {
			personUpserted {
				id
			}
		}
	`
}
