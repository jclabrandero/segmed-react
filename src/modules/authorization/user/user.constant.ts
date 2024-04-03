
import { gql } from '@apollo/client'


export const query = {
	USERS: gql`
		query users {
			users {
				id userName displayName email status
				groups { id name }
			}
		}
	`,
	CURRENT_USER: gql`
		query CurrentUser($sessionId: Int!) {
			currentUser(sessionId: $sessionId) {
				id userName displayName
				groups { id name }
				permissions
				isAuthorized
			}
		}
	`,
	USER: gql`
		query user($id: Int!) {
			user(id: $id) {
				id userName displayName email status
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query dependencies {
			groups: activeGroups {
				id name
			}
		}
	`,
	UPDATE_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			groups: activeGroups {
				id name
			}
			user(id: $id) {
				id userName displayName email
				groups { id }
			}
		}
	`
}

export const mutation = {
	CREATE_USER: gql`
		mutation create($data: IUserCreateArgs!) {
			user: createUser(data: $data) {
				id
			}
		}
	`,
	UPDATE_USER: gql`
		mutation update($id: Int!, $data: IUserUpdateArgs!) {
			user: updateUser(id: $id, data: $data) {
				id
			}
		}
	`
}

export const subscription = {
	USER_UPSERTED: gql`
		subscription upserted {
			userUpserted {
				id
			}
		}
	`
}
