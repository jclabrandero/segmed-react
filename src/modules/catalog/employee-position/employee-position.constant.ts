
import { gql } from '@apollo/client'


export const query = {
	EMPLOYEE_POSITIONS: gql`
		query employeePositions {
			employeePositions {
				id name description status
			}
		}
	`,
	EMPLOYEE_POSITION: gql`
		query employeePosition($id: Int!) {
			employeePosition(id: $id) {
				id name description status
			}
		}
	`
}

export const mutation = {
	CREATE_EMPLOYEE_POSITION: gql`
		mutation create($data: IEmployeePositionCreateArgs!) {
			employeePosition: createEmployeePosition(data: $data) {
				id
			}
		}
	`,
	UPDATE_EMPLOYEE_POSITION: gql`
		mutation update($id: Int!, $data: IEmployeePositionUpdateArgs!) {
			employeePosition: updateEmployeePosition(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_EMPLOYEE_POSITION: gql`
		mutation delete($id: Int!) {
			employeePosition: deleteEmployeePosition(id: $id) {
				id
			}
		}
	`,
}

export const subscription = {
	EMPLOYEE_POSITION_UPSERTED: gql`
		subscription upserted {
			employeePositionUpserted {
				id
			}
		}
	`
}
