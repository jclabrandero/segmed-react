
import { gql } from '@apollo/client'


export const query = {
	PHARMACIES: gql`
		query pharmacies {
			pharmacies {
				id name status
				belonging { id name }
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query dependencies {
			belongings: activeBelongings {
				id name
			}
		}
	`,
	UPDATE_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			pharmacy(id: $id) {
				id name status
				belonging { id name }
			}
			belongings: activeBelongings {
				id name
			}
		}
	`
}

export const mutation = {
	CREATE_PHARMACY: gql`
		mutation create($data: IPharmacyCreateArgs!) {
			pharmacy: createPharmacy(data: $data) {
				id
			}
		}
	`,
	UPDATE_PHARMACY: gql`
		mutation update($id: Int!, $data: IPharmacyUpdateArgs!) {
			pharmacy: updatePharmacy(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_PHARMACY: gql`
		mutation delete($id: Int!) {
			pharmacy: deletePharmacy(id: $id) {
				id
			}
		}
	`
}

export const subscription = {
	PHARMACY_UPSERTED: gql`
		subscription upserted {
			pharmacyUpserted {
				id
			}
		}
	`
}
