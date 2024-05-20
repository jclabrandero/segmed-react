
import { gql } from '@apollo/client'


export const query = {
	PERMISSIONS: gql`
		query permissions {
			permissions {
				id code name description status
			}
		}
	`
}
