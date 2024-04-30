
import { gql } from '@apollo/client'


export const query = {
	DRUG_CLASESS: gql`
		query drugClasess {
			drugClasess {
				id name description status
			}
		}
	`,
	DRUG_CLASS: gql`
		query drugClass($id: Int!) {
			drugClass(id: $id) {
				id name description status
			}
		}
	`
}

export const mutation = {
	CREATE_DRUG_CLASS: gql`
		mutation create($data: IDrugClassCreateArgs!) {
			drugClass: createDrugClass(data: $data) {
				id
			}
		}
	`,
	UPDATE_DRUG_CLASS: gql`
		mutation update($id: Int!, $data: IDrugClassUpdateArgs!) {
			drugClass: updateDrugClass(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_DRUG_CLASS: gql`
		mutation delete($id: Int!) {
			drugClass: deleteDrugClass(id: $id) {
				id
			}
		}
	`,
}

export const subscription = {
	DRUG_CLASS_UPSERTED: gql`
		subscription upserted {
			drugClassUpserted {
				id
			}
		}
	`
}
