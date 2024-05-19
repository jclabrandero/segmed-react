
import { gql } from '@apollo/client'


export const query = {
	DISABILITY_TYPES: gql`
		query disabilityTypes {
			disabilityTypes {
				id name description status
			}
		}
	`,
	DISABILITY_TYPE: gql`
		query disabilityType($id: Int!) {
			disabilityType(id: $id) {
				id name description status
			}
		}
	`
}

export const mutation = {
	CREATE_DISABILITY_TYPE: gql`
		mutation create($data: IDisabilityTypeCreateArgs!) {
			disabilityType: createDisabilityType(data: $data) {
				id
			}
		}
	`,
	UPDATE_DISABILITY_TYPE: gql`
		mutation update($id: Int!, $data: IDisabilityTypeUpdateArgs!) {
			disabilityType: updateDisabilityType(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_DISABILITY_TYPE: gql`
		mutation delete($id: Int!) {
			disabilityType: deleteDisabilityType(id: $id) {
				id
			}
		}
	`
}

export const subscription = {
	DISABILITY_TYPE_UPSERTED: gql`
		subscription upserted {
			disabilityTypeUpserted {
				id
			}
		}
	`
}
