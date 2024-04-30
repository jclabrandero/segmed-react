
import { gql } from '@apollo/client'


export const query = {
	MEDICAL_SPECIALTIES: gql`
		query medicalSpecialties {
			medicalSpecialties {
				id name description status
				__typename @skip(if: true)
				subspecialties {
					id name
					__typename @skip(if: true)
				}
			}
		}
	`,
	MEDICAL_SPECIALTY: gql`
		query medicalSpecialty($id: Int!) {
			medicalSpecialty(id: $id) {
				id name description status
				__typename @skip(if: true)
				subspecialties {
					id name
					__typename @skip(if: true)
				}
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query dependencies {
			subspecialties: activeMedicalSubspecialties {
				id name
			}
		}
	`,
	UPDATE_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			medicalSpecialty(id: $id) {
				id name description
				__typename @skip(if: true)
				subspecialties {
					id name
					__typename @skip(if: true)
				}
			}
			subspecialties: activeMedicalSubspecialties {
				id name
			}
		}
	`
}

export const mutation = {
	CREATE_MEDICAL_SPECIALTY: gql`
		mutation create($data: IMedicalSpecialtyCreateArgs!) {
			medicalSpecialty: createMedicalSpecialty(data: $data) {
				id
			}
		}
	`,
	UPDATE_MEDICAL_SPECIALTY: gql`
		mutation update($id: Int!, $data: IMedicalSpecialtyUpdateArgs!) {
			medicalSpecialty: updateMedicalSpecialty(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_MEDICAL_SPECIALTY: gql`
		mutation delete($id: Int!) {
			medicalSpecialty: deleteMedicalSpecialty(id: $id) {
				id
			}
		}
	`
}

export const subscription = {
	MEDICAL_SPECIALTY_UPSERTED: gql`
		subscription upserted {
			medicalSpecialtyUpserted {
				id
			}
		}
	`
}
