export type ProviderAgreement = {
	id:			number
	providerId: number
	name:		string
	validFrom:	string
	validTo?:	string
	status:		number
	provider: {
		id:		number
		businessName:	string
	}
	tariff: ProviderTariff[]
}

// export type ProviderTariff = {
// 	id:						number
// 	providerAgreementId:	number
// 	medicalSpecialtyId:		number
// 	medicalSubspecialtyId?: number
// 	currencyUMA:			number
// 	exchangerate:			number
// 	cost:					number
// 	status:					number
// 	medicalSpecialty?: {
// 		id:		number
// 		name:	string
// 	}
// 	medicalSubspecialty?: {
// 		id:		number
// 		name:	string
// 	}
// }

export interface ProviderTariff {
	id: number
	currencyUMA: number
	exchangeRate: number
	priceBs: number
	agreementId: number
	providerMedicalSpecialtyId: number
	providerMedicalSubspecialtyId?: number
	status: number
	providerMedicalSpecialty: {
		id: number
		medicalSpecialty: {
			id: number
			name: string
		}
	}
	providerMedicalSubspecialty?: {
		id: number
		medicalSubspecialty: {
			id: number
			name: string
		}
	}
}
