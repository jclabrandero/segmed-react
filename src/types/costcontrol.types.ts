export type ProviderAgreement = {
	id:					number
	providerId: number
	name:				string
	validFrom:	string
	validTo?:		string
	status:			number
	provider: {
		id: 	number
		name: string
	}
	rates: ProviderTariff[]
}

export type ProviderTariff = {
	id:											number
	providerAgreementId: 		number
	medicalSpecialtyId: 		number
	medicalSubspecialtyId?: number
	currencyUMA: 						number
	exchangerate:						number
	cost: 									number
	status: 								number
	medicalSpecialty?: {
		id: 	number
		name: string
	}
	medicalSubspecialty?: {
		id: 	number
		name: string
	}
}
