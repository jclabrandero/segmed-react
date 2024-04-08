
import { gql } from '@apollo/client'


export const query = {
	EMPLOYEE_TYPES: gql`
		query employeeTypes {
			employeeTypes {
				id name description status
			}
		}
	`,
	EMPLOYEE_TYPE: gql`
		query employeeType($id: Int!) {
			employeeType(id: $id) {
				id name description status
			}
		}
	`
}

export const mutation = {
	CREATE_EMPLOYEE_TYPE: gql`
		mutation create($data: IEmployeeTypeCreateArgs!) {
			employeeType: createEmployeeType(data: $data) {
				id
			}
		}
	`,
	UPDATE_EMPLOYEE_TYPE: gql`
		mutation update($id: Int!, $data: IEmployeeTypeUpdateArgs!) {
			employeeType: updateEmployeeType(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_EMPLOYEE_TYPE: gql`
		mutation delete($id: Int!) {
			employeeType: deleteEmployeeType(id: $id) {
				id
			}
		}
	`,
}

export const subscription = {
	EMPLOYEE_TYPE_UPSERTED: gql`
		subscription upserted {
			employeeTypeUpserted {
				id
			}
		}
	`
}
