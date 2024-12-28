
import { gql } from '@apollo/client'


export const query = {
	INSURED_TYPES: gql`
		query insuredTypes {
			insuredTypes {
				id name description withDependents codeFormat outletAge status
			}
		}
	`,
	INSURED_TYPE: gql`
		query insuredType($id: Int!) {
			insuredType(id: $id) {
				id name description withDependents codeFormat outletAge status
			}
		}
	`
}

export const mutation = {
	CREATE_INSURED_TYPE: gql`
		mutation create($data: IInsuredTypeCreateArgs!) {
			insuredType: createInsuredType(data: $data) {
				id
			}
		}
	`,
	UPDATE_INSURED_TYPE: gql`
		mutation update($id: Int!, $data: IInsuredTypeUpdateArgs!) {
			insuredType: updateInsuredType(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_INSURED_TYPE: gql`
		mutation delete($id: Int!) {
			insuredType: deleteInsuredType(id: $id) {
				id
			}
		}
	`
}

export const subscription = {
	INSURED_TYPE_UPSERTED: gql`
		subscription upserted {
			insuredTypeUpserted {
				id
			}
		}
	`
}
