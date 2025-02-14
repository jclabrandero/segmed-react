
import { gql } from '@apollo/client'


export const query = {
	MEDICAL_LEAVE: gql`
		query medicalLeave($id: Int!) {
			medicalLeave(id: $id) {
				id reason startDate endDate
				disabilityType {
					id name
					__typename @skip(if: true)
				}
			}
		}
	`,
	CREATE_DEPENDENCIES: gql`
		query dependencies {
			disabilityTypes: activeDisabilityTypes {
				id name
			}
		}
	`,
	UPDATE_DEPENDENCIES: gql`
		query dependencies($id: Int!) {
			medicalLeave(id: $id) {
				id reason startDate endDate
				disabilityType {
					id name
					__typename @skip(if: true)
				}
			}
			disabilityTypes: activeDisabilityTypes {
				id name
			}
		}
	`
}

export const mutation = {
	CREATE_MEDICAL_LEAVE: gql`
		mutation create($data: IMedicalLeaveCreateArgs!) {
			createMedicalLeave(data: $data) {
				id
			}
		}
	`,
	UPDATE_MEDICAL_LEAVE: gql`
		mutation create($id: Int!, $data: IMedicalLeaveUpdateArgs!) {
			updateMedicalLeave(id: $id, data: $data) {
				id
			}
		}
	`,
	DELETE_MEDICAL_LEAVE: gql`
		mutation delete($id: Int!, $data: IMedicalLeaveUpdateArgs!) {
			deleteMedicalLeave(id: $id, data: $data) {
				id
			}
		}
	`,
	APPROVE_MEDICAL_LEAVE: gql`
		mutation delete($id: Int!, $data: IMedicalLeaveUpdateArgs!) {
			approveMedicalLeave(id: $id, data: $data) {
				id
			}
		}
	`,
	PRINT_MEDICAL_LEAVE: gql`
	mutation print($id: Int!) {
			file: printMedicalLeave(id: $id) {
				data
				info { type }
			}
		}
	`
}
