
import { gql } from '@apollo/client'


export const query = {
	CLINIC_CARES_INSURED_HISTORY: gql`
		query filterClinicCares($filter: IFilterClinicCare!, $id: Int!) {
			filterClinicCares(filter: $filter) {
				id startDate endDate
				primary { reason diagnosis }
				insured {
					code iin
					person { firstName lastName }
					insuredType { name }
				}
				state { name color }
				medicalOffice { name }
				creatorUser { userName displayName }
			},
			insured(id: $id) {
				id code iin inletDate outletDate tradeUnion address phone status
				person { id firstName lastName }
				insuredType { id name }
				holderInsured { id code }
				dependents { id code }
				belonging { id name }
			}
		}
	`,
}

export const subscription = {
	CLINIC_CARE_UPSERTED: gql`
		subscription upserted {
			clinicCareUpserted {
				id
			}
		}
	`
}