
import { gql } from '@apollo/client'


export const query = {
	PROVIDERS: gql`
		query providers {
			providers {
				id vendorCode businessName nit address phone status
				belonging { id name }
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query dependencias {
			belongings: activeBelongings {
				id name
			}
			medicalGroups: activeMedicalGroups {
				id name
				specialties {
					id name
					subspecialties {
						id name
						__typename @skip(if: true)
					}
					__typename @skip(if: true)
				}
				__typename @skip(if: true)
			}
		}
	`,
	UPDATE_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			provider(id: $id) {
				id vendorCode businessName nit address phone
				belonging { id name }
				medicalGroups {
					id name
					specialties {
						id name
						subspecialties {
							id name
							__typename @skip(if: true)
						}
						__typename @skip(if: true)
					}
					__typename @skip(if: true)
				}
			}
			belongings: activeBelongings {
				id name
			}
			medicalGroups: activeMedicalGroups {
				id name
				specialties {
					id name
					subspecialties {
						id name
						__typename @skip(if: true)
					}
					__typename @skip(if: true)
				}
				__typename @skip(if: true)
			}
		}
	`,
}

export const mutation = {
	CREATE_PROVIDER: gql`
		mutation create($data: IProviderCreateArgs!) {
			provider: createProvider(data: $data) {
				id
			}
		}
	`,
	UPDATE_PROVIDER: gql`
		mutation update($id: Int!, $data: IProviderUpdateArgs!) {
			provider: updateProvider(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_PROVIDER: gql`
		mutation delete($id: Int!) {
			provider: deleteProvider(id: $id) {
				id
			}
		}
	`
}

export const subscription = {
	PROVIDER_UPSERTED: gql`
		subscription upserted {
			providerUpserted {
				id
			}
		}
	`
}
