
import { gql } from '@apollo/client'


export const query = {
	MEDICATIONS: gql`
		query medications {
			medications {
				id code name concentration liname status
				class { id name }
				unit { id name }
			}
		}
	`,
	MEDICATION: gql`
		query medication($id: Int!) {
			medication(id: $id) {
				id code name concentration liname status
				class { id name }
				unit { id name }
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query dependencies {
			clasess: activeDrugClasess {
				id name
			}
			units: activeDrugUnits {
				id name
			}
		}
	`,
	UPDATE_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			medication(id: $id) {
				id code name concentration liname status
				class { id name }
				unit { id name }
			}
			clasess: activeDrugClasess {
				id name
			}
			units: activeDrugUnits {
				id name
			}
		}
	`
}

export const mutation = {
	CREATE_MEDICATION: gql`
		mutation create($data: IMedicationCreateArgs!) {
			medication: createMedication(data: $data) {
				id
			}
		}
	`,
	UPDATE_MEDICATION: gql`
		mutation update($id: Int!, $data: IMedicationUpdateArgs!) {
			medication: updateMedication(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_MEDICATION: gql`
		mutation delete($id: Int!) {
			medication: deleteMedication(id: $id) {
				id
			}
		}
	`
}

export const subscription = {
	MEDICATION_UPSERTED: gql`
		subscription upserted {
			medicationUpserted {
				id
			}
		}
	`
}
