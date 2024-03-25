
import { gql } from '@apollo/client'


export const query = {
	USERS: gql`
		query users {
			users {
				id userName displayName email status
			}
		}
	`,
	CURRENT_USER: gql`
		query CurrentUser($sessionId: Int!) {
			currentUser(sessionId: $sessionId) {
				id userName displayName
				isAuthorized @client
			}
		}
	`,
	USER: gql`
		query user($id: Int!) {
			user(id: $id) {
				id userName displayName email status
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
