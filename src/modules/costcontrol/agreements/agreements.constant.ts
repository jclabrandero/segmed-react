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
	CREATE_AGREEMENT_DEPENDENCIES: gql`
	query {
	agreementDependencies {
	providers { id name }
	}
	}
	`,
	UPDATE_AGREEMENT_DEPENDENCIES: gql`
	query updateAgreementDependencies($id: Int!) {
	agreement(id: $id) {
	id name validFrom validTo status provider { id name }
	}
	agreementDependencies {
	providers { id name }
	}
}
`,
	CREATE_AGREEMENT_RATE_DEPENDENCIES: gql`
	query {
		agreementRateDependencies {
		medicalSpecialties { id name }
		medicalSubspecialties { id name }
	}
	}
	`,
	UPDATE_AGREEMENT_RATE_DEPENDENCIES: gql`
	query updateAgreementRateDependencies($id: Int!) {
	agreementRate(id: $id) {
	id medicalSpecialtyId medicalSubspecialtyId currencyUMA exchangerate cost status
	}
	agreementRateDependencies {
	medicalSpecialties { id name }
	medicalSubspecialties { id name }
	}
	}
	`,
}

export const mutation = {
	CREATE_AGREEMENT: gql`
	mutation createAgreement($input: AgreementInput!) {
	  createAgreement(input: $input) {
		id
	  }
	}
  `,
	UPDATE_AGREEMENT: gql`
	mutation updateAgreement($id: Int!, $input: AgreementInput!) {
	  updateAgreement(id: $id, input: $input) {
		id
	  }
	}
  `,
	DELETE_AGREEMENT: gql`
	mutation deleteAgreement($id: Int!) {
	  deleteAgreement(id: $id) {
		id
	  }
	}
  `,
	CREATE_AGREEMENT_RATE: gql`
	mutation createAgreementRate($input: AgreementRateInput!) {
	  createAgreementRate(input: $input) {
		id
	  }
	}
  `,
	UPDATE_AGREEMENT_RATE: gql`
	mutation updateAgreementRate($id: Int!, $input: AgreementRateInput!) {
	  updateAgreementRate(id: $id, input: $input) {
		id
	  }
	}
  `,
	DELETE_AGREEMENT_RATE: gql`
	mutation deleteAgreementRate($id: Int!) {
	  deleteAgreementRate(id: $id) {
		id
	  }
	}
  `,
}
