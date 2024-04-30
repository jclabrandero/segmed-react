
import { gql } from '@apollo/client'


export const query = {
	DRUG_UNITS: gql`
		query drugUnits {
			drugUnits {
				id name description status
			}
		}
	`,
	DRUG_UNIT: gql`
		query drugUnit($id: Int!) {
			drugUnit(id: $id) {
				id name description status
			}
		}
	`
}

export const mutation = {
	CREATE_DRUG_UNIT: gql`
		mutation create($data: IDrugUnitCreateArgs!) {
			drugUnit: createDrugUnit(data: $data) {
				id
			}
		}
	`,
	UPDATE_DRUG_UNIT: gql`
		mutation update($id: Int!, $data: IDrugUnitUpdateArgs!) {
			drugUnit: updateDrugUnit(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_DRUG_UNIT: gql`
		mutation delete($id: Int!) {
			drugUnit: deleteDrugUnit(id: $id) {
				id
			}
		}
	`,
}

export const subscription = {
	DRUG_UNIT_UPSERTED: gql`
		subscription upserted {
			drugUnitUpserted {
				id
			}
		}
	`
}
