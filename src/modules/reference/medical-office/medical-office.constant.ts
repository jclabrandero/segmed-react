
import { gql } from '@apollo/client'


export const query = {
	MEDICAL_OFFICES: gql`
		query medicalOffices {
			medicalOffices {
				id name status
				belonging { id name }
			}
		}
	`,
	MEDICAL_OFFICE: gql`
		query medicalOffice($id: Int!) {
			medicalOffice(id: $id) {
				id name status
				belonging { id name }
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query dependencies {
			belongings: activeBelongings {
				id name
			}
		}
	`,
	UPDATE_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			medicalOffice(id: $id) {
				id name
				belonging { id }
			}
			belongings: activeBelongings {
				id name
			}
		}
	`
}

export const mutation = {
	CREATE_MEDICAL_OFFICE: gql`
		mutation create($data: IMedicalOfficeCreateArgs!) {
			medicalOffice: createMedicalOffice(data: $data) {
				id
			}
		}
	`,
	UPDATE_MEDICAL_OFFICE: gql`
		mutation update($id: Int!, $data: IMedicalOfficeUpdateArgs!) {
			medicalOffice: updateMedicalOffice(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_MEDICAL_OFFICE: gql`
		mutation delete($id: Int!) {
			medicalOffice: deleteMedicalOffice(id: $id) {
				id
			}
		}
	`,
}

export const subscription = {
	MEDICAL_OFFICE_UPSERTED: gql`
		subscription upserted {
			medicalOfficeUpserted {
				id
			}
		}
	`
}
