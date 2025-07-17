import { DeleteDialog, UpdateDialog, CreateDialog } from '../../../components'
import { mutation, query } from './agreements.constant'
import { AgreementForm, AgreementRateForm } from './agreements.forms'
import type { ProviderAgreement, ProviderTariff } from './costcontrol.types'
//import type { AgreementFormProps, AgreementRateFormProps } from './agreements.types'

export function CreateAgreement() {
	return (
		<CreateDialog<
		Partial<ProviderAgreement>,
		{ agreementDependencies: { providers: { id: number; name: string }[] } }
		>
			title="Nuevo convenio"
			// query={query.CREATE_AGREEMENT_DEPENDENCIES}
			mutation={mutation.CREATE_AGREEMENT}
			render={(submit, close) => (
				<AgreementForm
					mode="create"
					// dependencies={dependencies.agreementDependencies}
					dependencies={{ providers: [{ id: 1, name: 'Proveedor Prueba' }] }}
					onSubmit={submit}
					onCancel={close}
				/>
			)}
		/>
	)
}

export function UpdateAgreement({ id }: { id: number }) {
	return (
		<UpdateDialog<
		Partial<ProviderAgreement>,
		{ agreement: ProviderAgreement; agreementDependencies: { providers: { id: number; name: string }[] } }
		>
			id={id}
			title="Editar convenio"
			query={query.UPDATE_AGREEMENT_DEPENDENCIES}
			mutation={mutation.UPDATE_AGREEMENT}
			render={(submit, close, data) => (
				<AgreementForm
					mode="update"
					data={data.agreement}
					dependencies={data.agreementDependencies}
					onSubmit={submit}
					onCancel={close}
				/>
			)}
		/>
	)
}

export function DeleteAgreement({ id }: { id: number }) {
	return (
		<DeleteDialog<ProviderAgreement>
			id={id}
			title="¿Eliminar convenio?"
			query={query.PROVIDER_AGREEMENT}
			mutation={mutation.DELETE_AGREEMENT}
		/>
	)
}

export function CreateAgreementRate({ agreementId, onRefetch }: { agreementId: number; onRefetch: () => void }) {
	return (
		<CreateDialog<
		Partial<ProviderTariff>,
		{
			agreementRateDependencies: {
				medicalSpecialties: { id: number; name: string }[]
				medicalSubspecialties: { id: number; name: string }[]
			}
		}
		>
			title="Nueva tarifa"
			query={query.CREATE_AGREEMENT_RATE_DEPENDENCIES}
			mutation={mutation.CREATE_AGREEMENT_RATE}
			options={{ variables: { agreementId } }}
			render={(submit, close, dependencies) => (
				<AgreementRateForm
					mode="create"
					dependencies={dependencies.agreementRateDependencies}
					onSubmit={submit}
					onCancel={close}
					onRefetch={onRefetch}
				/>
			)}
		/>
	)
}

export function UpdateAgreementRate({ id, onRefetch }: { id: number; onRefetch: () => void }) {
	return (
		<UpdateDialog<
		Partial<ProviderTariff>,
		{
			agreementRate: ProviderTariff
			agreementRateDependencies: {
				medicalSpecialties: { id: number; name: string }[]
				medicalSubspecialties: { id: number; name: string }[]
			}
		}
		>
			id={id}
			title="Editar tarifa"
			query={query.UPDATE_AGREEMENT_RATE_DEPENDENCIES}
			mutation={mutation.UPDATE_AGREEMENT_RATE}
			render={(submit, close, data) => (
				<AgreementRateForm
					mode="update"
					data={data.agreementRate}
					dependencies={data.agreementRateDependencies}
					onSubmit={submit}
					onCancel={close}
					onRefetch={onRefetch}
				/>
			)}
		/>
	)
}

export function DeleteAgreementRate({ id }: { id: number }) {
	return (
		<DeleteDialog<ProviderTariff>
			id={id}
			title="¿Eliminar tarifa?"
			query={query.PROVIDER_AGREEMENT}
			mutation={mutation.DELETE_AGREEMENT_RATE}
		/>
	)
}
