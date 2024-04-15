
import { gql } from '@apollo/client'


export const query = {
	CLERKS: gql`
		query clerks {
			clerks {
				id ein status
				person { firstName lastName }
				position { name }
				employeeType { name }
				medicalOffices { name }
			}
		}
	`,
	CLERK: gql`
		query clerk($id: Int!) {
			clerk(id: $id) {
				id ein status
				person { firstName lastName }
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query dependencies {
			people: activePersons {
				id firstName lastName
			}
			employeePositions: activeEmployeePositions {
				id name
			}
			employeeTypes: activeEmployeeTypes {
				id name
			}
			medicalOffices: activeMedicalOffices {
				id name
			}
		}
	`,
	UPDATE_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			clerk(id: $id) {
				id ein status
				person { id firstName lastName }
				position { id name }
				employeeType { id name }
				medicalOffices { id name }
			}
			people: activePersons {
				id firstName lastName
			}
			employeePositions: activeEmployeePositions {
				id name
			}
			employeeTypes: activeEmployeeTypes {
				id name
			}
			medicalOffices: activeMedicalOffices {
				id name
			}
		}
	`
}

export const mutation = {
	CREATE_CLERK: gql`
		mutation create($data: IClerkCreateArgs!) {
			clerk: createClerk(data: $data) {
				id
			}
		}
	`,
	UPDATE_CLERK: gql`
		mutation update($id: Int!, $data: IClerkUpdateArgs!) {
			clerk: updateClerk(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_CLERK: gql`
		mutation delete($id: Int!) {
			clerk: deleteClerk(id: $id) {
				id
			}
		}
	`
}

export const subscription = {
	CLERK_UPSERTED: gql`
		subscription upserted {
			clerkUpserted {
				id
			}
		}
	`
}
