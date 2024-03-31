
import { gql } from '@apollo/client'


export const query = {
	GROUPS: gql`
		query groups {
			groups {
				id name description status
				members { id userName }
				permissions { id code }
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query dependencies {
			permissions: activePermissions {
				id code description
			}
		}
	`,
	UPDATE_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			permissions: activePermissions {
				id code description
			}
			group(id: $id) {
				id name description
				permissions { id }
			}
		}
	`
}

export const mutation = {
	CREATE_GROUP: gql`
		mutation create($data: IGroupCreateArgs!) {
			group: createGroup(data: $data) {
				id
			}
		}
	`,
	UPDATE_GROUP: gql`
		mutation update($id: Int!, $data: IGroupUpdateArgs!) {
			group: updateGroup(id: $id, data: $data) {
				id
			}
		}
	`
}

export const subscription = {
	GROUP_UPSERTED: gql`
		subscription upserted {
			groupUpserted {
				id
			}
		}
	`
}
