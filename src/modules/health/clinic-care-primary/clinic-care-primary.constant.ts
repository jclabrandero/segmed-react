
import { gql } from '@apollo/client'


export const query = {
	CLINIC_CARE_PRIMARY: gql`
		query clinicCarePrimary($id: Int!) {
			primary: clinicCarePrimary(id: $id) {
				id reason physicalExam diagnosis
			}
		}
	`
}

export const mutation = {
	UPSERT_CLINIC_CARE_PRIMARY: gql`
		mutation upsert($data: IClinicCarePrimaryUpsertArgs!) {
			upsertClinicCarePrimary(data: $data) {
				id
			}
		}
	`
}
