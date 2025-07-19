import type { ProviderAgreement, ProviderTariff } from './costcontrol.types'

export type AgreementFormProps = {
	mode: 'create' | 'update'
	data?: Partial<ProviderAgreement>
	dependencies: {
		providers: { id: number; businessName: string }[]
	}
	onSubmit: (data: Partial<ProviderAgreement>) => void
	onCancel: () => void
	onRefetch?: () => void
}

export type AgreementRateFormProps = {
	mode: 'create' | 'update'
	data?: Partial<ProviderTariff>
	dependencies: {
		medicalSpecialties: { id: number; name: string }[]
		medicalSubspecialties: { id: number; name: string }[]
	}
	onSubmit: (data: Partial<ProviderTariff>) => void
	onCancel: () => void
	onRefetch?: () => void
}
