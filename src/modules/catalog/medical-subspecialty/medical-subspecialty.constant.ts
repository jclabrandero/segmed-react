
import { gql } from '@apollo/client'


export const query = {
	MEDICAL_SUBSPECIALTIES: gql`
		query serviciosMedicos {
			medicalSubspecialties {
				id name description ageRangePatients dt si ot status
			}
		}
	`,
	MEDICAL_SUBSPECIALTY: gql`
		query servicioMedico($id: Int!) {
			medicalSubspecialty(id: $id) {
				id name description ageRangePatients dt si ot status
			}
		}
	`
}

export const mutation = {
	CREATE_MEDICAL_SUBSPECIALTY: gql`
		mutation create($data: IMedicalSubspecialtyCreateArgs!) {
			medicalSubspecialty: createMedicalSubspecialty(data: $data) {
				id
			}
		}
	`,
	UPDATE_MEDICAL_SUBSPECIALTY: gql`
		mutation update($id: Int!, $data: IMedicalSubspecialtyUpdateArgs!) {
			medicalSubspecialty: updateMedicalSubspecialty(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_MEDICAL_SUBSPECIALTY: gql`
		mutation delete($id: Int!) {
			medicalSubspecialty: deleteMedicalSubspecialty(id: $id) {
				id
			}
		}
	`
}

export const subscription = {
	MEDICAL_SUBSPECIALTY_UPSERTED: gql`
		subscription upserted {
			medicalSubspecialtyUpserted {
				id
			}
		}
	`
}
