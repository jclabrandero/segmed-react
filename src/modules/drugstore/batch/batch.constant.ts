
import { gql } from '@apollo/client'

export const query = {
	BATCHES: gql`
		query batches {
			batches {
				id code expireAt status
				medication {
					id code name concentration
					unit {
						id name
						__typename @skip(if: true)
					}
					__typename @skip(if: true)
				}
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query medications {
			medications {
				id code name concentration liname status
				class { id name }
				unit { id name }
			}
		}
	`,
}

export const mutation = {
	CREATE_BATCH: gql`
		mutation create($data: IBatchCreateArgs!) {
			createBatch(data: $data) {
				id
			}
		}
	`,
}

export const subscription = {
	BATCH_UPSERTED: gql`
		subscription upserted {
			batchUpserted {
				id
			}
		}
	`
}
