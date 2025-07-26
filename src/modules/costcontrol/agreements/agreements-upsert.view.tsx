import { DeleteDialog, UpdateDialog, CreateDialog } from '../../../components'
import { mutation, query } from './agreements.constant'
import { AgreementForm, AgreementRateForm } from './agreements.forms'
import type { ProviderAgreement, ProviderTariff } from './costcontrol.types'
import { UndoOutlined , StopOutlined } from '@ant-design/icons'
import { UpdateProps } from '../../../types'

export function CreateAgreement() {
	return (
		<CreateDialog<
		Partial<ProviderAgreement>,
		{ providers: { id: number; businessName: string }[] }
		>
			title="Nuevo convenio"
			query={query.CREATE_AGREEMENT_DEPENDENCIES}
			mutation={mutation.CREATE_AGREEMENT}
			render={(submit, close, data) => (
				<AgreementForm
					mode="create"
					dependencies={data}
					//dependencies={{ providers: [{ id: 1, name: 'Proveedor Prueba' }] }}
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
		{ agreement: ProviderAgreement; agreementDependencies: { providers: { id: number; businessName: string }[] } }
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

export function UpgradeAgreement({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ agreement: ProviderAgreement }>
			id={id}
			title='Activar Convenio'
			icon={<UndoOutlined style={{ color: 'blue' }}/>}
			//renderExt={({ agreement }) => `Rehabilitar a: ${agreement.name}`}
			confirmButtonText={'Activar'}
			query={query.PROVIDER_AGREEMENTS}
			mutation={mutation.UPGRADE_AGREEMENT}
		/>
	)
}

export function DowngradeAgreement({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ agreement: ProviderAgreement }>
			id={id}
			title='Inactivar Convenio'
			icon={<StopOutlined style={{ color: 'orange' }}/>}
			//renderExt={({ agreement }) => `Deshabilitar a: ${agreement.name}`}
			confirmButtonText={'Inactivar'}
			query={query.PROVIDER_AGREEMENTS}
			mutation={mutation.DOWNGRADE_AGREEMENT}
		/>
	)
}

interface CreateAgreementRateProps {
	agreementId: number
	providerId: number
	onRefetch?: () => void
}

export function CreateAgreementRate({ agreementId, providerId, onRefetch }: CreateAgreementRateProps) {
	return (
		<CreateDialog<Partial<ProviderTariff>>
			title="Nueva tarifa"
			mutation={mutation.CREATE_AGREEMENT_RATE}
			render={(submit, close) => (
				<AgreementRateForm
					mode="create"
					agreementId={agreementId}
					providerId={providerId}
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
			render={(submit, close, data) => {
				const specialties = data.agreementRateDependencies.medicalSpecialties.map(s => ({
					id: s.id,
					medicalSpecialty: { id: s.id, name: s.name },
					subspecialties: data.agreementRateDependencies.medicalSubspecialties.map(sub => ({
						id: sub.id,
						medicalSubspecialty: { id: sub.id, name: sub.name }
					})),
				}))

				return (
					<AgreementRateForm
						mode="update"
						data={data.agreementRate}
						dependencies={{ specialties }}
						onSubmit={submit}
						onCancel={close}
						onRefetch={onRefetch}
					/>
				)
			}}
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
