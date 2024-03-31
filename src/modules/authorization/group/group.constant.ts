
import { gql } from '@apollo/client'


export const query = {
	GROUPS: gql`
		query groups {
			groups {
				id name description status
				permissions { code }
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
}

export const mutation = {
	CREATE_GROUP: gql`
		mutation create($data: IGroupCreateArgs!) {
			group: createGroup(data: $data) {
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
