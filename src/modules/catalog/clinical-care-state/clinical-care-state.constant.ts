
import { gql } from '@apollo/client'


export const query = {
	CLINICAL_CARE_STATES: gql`
		query clinicalCareStates {
			clinicalCareStates {
				id name description color lock status
			}
		}
	`,
	CLINICAL_CARE_STATE: gql`
		query clinicalCareState($id: Int!) {
			clinicalCareState(id: $id) {
				id name description color state
			}
		}
	`
}

export const mutation = {
	CREATE_CLINICAL_CARE_STATE: gql`
		mutation create($data: IClinicalCareStateCreateArgs!) {
			clinicalCareState: createClinicalCareState(data: $data) {
				id
			}
		}
	`,
	UPDATE_CLINICAL_CARE_STATE: gql`
		mutation update($id: Int!, $data: IClinicalCareStateUpdateArgs!) {
			clinicalCareState: updateClinicalCareState(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_CLINICAL_CARE_STATE: gql`
		mutation delete($id: Int!) {
			clinicalCareState: deleteClinicalCareState(id: $id) {
				id
			}
		}
	`
}

export const subscription = {
	CLINICAL_CARE_STATE_UPSERTED: gql`
		subscription upserted {
			clinicalCareStateUpserted {
				id
			}
		}
	`
}
