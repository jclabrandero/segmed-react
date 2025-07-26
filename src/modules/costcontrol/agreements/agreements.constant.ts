import { gql } from '@apollo/client'


export const query = {
	PROVIDER_AGREEMENTS: gql`
		query providerAgreements {
			agreements {
				id name validFrom validTo status
				provider { id businessName }
				# rates {
				# 	id medicalSpecialtyId medicalSubspecialtyId currencyUMA exchangerate cost status
				# 	medicalSpecialty { id name }
				# 	medicalSubspecialty { id name }
				# }
			}
		}
	`,
	PROVIDER_AGREEMENT: gql`
		query providerAgreement($id: Int!) {
			agreement(id: $id) {
				id name validFrom validTo status
				provider { id businessName }
				}
		}
	`,
	TARIFF_ITEMS: gql`
    query tariffItems($agreementId: Int!) {
        tariffItems(agreementId: $agreementId) {
            id
            currencyUMA
            exchangeRate
            priceBs
            status
            providerMedicalSpecialty {
                medicalSpecialty {
                    id
                    name
                }
            }
            providerMedicalSubspecialty {
                medicalSubspecialty {
                    id
                    name
                }
            }
        }
    }
`,

	AGREEMENT_PROVIDER_SPECIALTIES: gql`
    query provider($id: Int!) {
    provider(id: $id) {
		medicalGroups {
        specialties {
          id
          name
          subspecialties {
            id
            name
          }
        }
      }

      }
    }
  
  `,
	CREATE_AGREEMENT_DEPENDENCIES: gql`
		query {
			providers { id businessName }
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
	// CREATE_AGREEMENT_RATE_DEPENDENCIES: gql`
	// query {
	// 	agreementRateDependencies {
	// 	medicalSpecialties { id name }
	// 	medicalSubspecialties { id name }
	// }
	// }
	// `,
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
		mutation createAgreement($data: IAgreementCreateArgs!) {
			createAgreement(data: $data) {
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
	UPGRADE_AGREEMENT: gql`
		mutation upgrade($id: Int!) {
			agreement: upgradeAgreement(id: $id) {
				id
			}
		}
	`,
	
	DOWNGRADE_AGREEMENT: gql`
		mutation downgrade($id: Int!) {
			agreement: downgradeAgreement(id: $id) {
				id
			}
		}
	`,
	
	CREATE_AGREEMENT_RATE: gql`
	mutation createTariff($data: ITariffCreateArgs!) {
	  createTariff(data: $data) {
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

export const subscription = {
	AGREEMENT_UPSERTED: gql`
		subscription agreement {
			agreementUpserted {
				id
			}
		}
	`,
	AGREEMENT_DELETED: gql`
		subscription agreement {	
			agreementDeleted {
				id
			}
		}
	`
}
