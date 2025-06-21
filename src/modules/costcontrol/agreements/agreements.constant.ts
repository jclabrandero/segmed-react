import { gql } from '@apollo/client'

export const query = {
	PROVIDER_AGREEMENTS: gql`
		query providerAgreements {
			providerAgreements {
				id name validFrom validTo status
				provider { id name }
				rates {
					id medicalSpecialtyId medicalSubspecialtyId currencyUMA exchangerate cost status
					medicalSpecialty { id name }
					medicalSubspecialty { id name }
				}
			}
		}
	`,
	PROVIDER_AGREEMENT: gql`
		query providerAgreement($id: Int!) {
			providerAgreement(id: $id) {
				id name validFrom validTo status
				provider { id name }
				rates {
					id medicalSpecialtyId medicalSubspecialtyId currencyUMA exchangerate cost status
					medicalSpecialty { id name }
					medicalSubspecialty { id name }
				}
			}
		}
	`,
}
