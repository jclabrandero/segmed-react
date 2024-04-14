
import { gql } from '@apollo/client'


export const query = {
	BELONGINGS: gql`
		query belongings {
			belongings {
				id name status
			}
		}
	`,
	BELONGING: gql`
		query belonging($id: Int!) {
			belonging(id: $id) {
				id name status
			}
		}
	`
}

export const mutation = {
	CREATE_BELONGING: gql`
		mutation create($data: IBelongingCreateArgs!) {
			belonging: createBelonging(data: $data) {
				id
			}
		}
	`,
	UPDATE_BELONGING: gql`
		mutation update($id: Int!, $data: IBelongingUpdateArgs!) {
			belonging: updateBelonging(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_BELONGING: gql`
		mutation delete($id: Int!) {
			belonging: deleteBelonging(id: $id) {
				id
			}
		}
	`,
}

export const subscription = {
	BELONGING_UPSERTED: gql`
		subscription upserted {
			belongingUpserted {
				id
			}
		}
	`
}
