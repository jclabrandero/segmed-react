
import { gql } from '@apollo/client'


export const query = {
	MEDICAL_GROUPS: gql`
		query medicalGroups {
			medicalGroups {
				id name description status
				__typename @skip(if: true)
				specialties {
					id name
					__typename @skip(if: true)
				}
			}
		}
	`,
	MEDICAL_GROUP: gql`
		query medicalGroup($id: Int!) {
			medicalGroup(id: $id) {
				id name description status
				__typename @skip(if: true)
				specialties {
					id name
					__typename @skip(if: true)
				}
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query dependencies {
			specialties: activeMedicalSpecialties {
				id name description
			}
		}
	`,
	UPDATE_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			medicalGroup(id: $id) {
				id name description
				__typename @skip(if: true)
				specialties {
					id name
					__typename @skip(if: true)
				}
			}
			specialties: activeMedicalSpecialties {
				id name description
			}
		}
	`,
}

export const mutation = {
	CREATE_MEDICAL_GROUP: gql`
		mutation create($data: IMedicalGroupCreateArgs!) {
			medicalGroup: createMedicalGroup(data: $data) {
				id
			}
		}
	`,
	UPDATE_MEDICAL_GROUP: gql`
		mutation update($id: Int!, $data: IMedicalGroupUpdateArgs!) {
			medicalGroup: updateMedicalGroup(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_MEDICAL_GROUP: gql`
		mutation delete($id: Int!) {
			medicalGroup: deleteMedicalGroup(id: $id) {
				id
			}
		}
	`
}

export const subscription = {
	MEDICAL_GROUP_UPSERTED: gql`
		subscription upserted {
			medicalGroupUpserted {
				id
			}
		}
	`
}
