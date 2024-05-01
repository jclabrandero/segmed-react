
import { gql } from '@apollo/client'


export const query = {
	CREATE_DEPENDENCIES: gql`
		query dependencies {
			belongings: activeBelongings {
				id name
			}
			medicalGroups: activeMedicalGroups {
				id name
			}
		}
	`,
	PROVIDERS: gql`
		query providers($query: IProviderFilterArgs!) {
			providers: activeProviders(query: $query) {
				id
				name: businessName
			}
		}
	`,
	PROVIDER: gql`
		query provider($id: Int!) {
			provider(id: $id) {
				id businessName
				medicalGroups {
					id name
					__typename @skip(if: true)
					specialties {
						id name
						subspecialties {
							id name
							__typename @skip(if: true)
						}
						__typename @skip(if: true)
					}
				}
			}
		}
	`,
	INTERCLINICAL: gql`
		query interclinical($id: Int!) {
			interclinical(id: $id) {
				id remark driftDate approvedState
				files { md5 name type }
			}
		}
	`,
	INTERCLINICAL_FILE: gql`
		query downloadFile($md5: String!) {
			downloadFile(md5: $md5) {
				data
				info { md5 name type }
			}
		}
	`
}

export const mutation = {
	CREATE_INTERCLINICAL: gql`
		mutation create($data: IInterclinicalCreateArgs!) {
			createInterclinical(data: $data) {
				id
			}
		}
	`,
	UPDATE_INTERCLINICAL: gql`
		mutation update($id: Int!, $data: IInterclinicalUpdateArgs!) {
			updateInterclinical(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_INTERCLINICAL: gql`
		mutation delete($id: Int!, $data: IInterclinicalUpdateArgs!) {
			deleteInterclinical(id: $id, data: $data) {
				id
			}
		}
	`,
	PRINT_INTERCLINICAL: gql`
		mutation print($id: Int!) {
			file: printInterclinical(id: $id) {
				data
				info { type }
			}
		}
	`
}
