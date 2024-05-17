
import { useSubscription } from '@apollo/client'
import { Button, Card, Divider, Form, Input, Select, Space, Tree, TreeSelect } from 'antd'

import { CreateDialog, InspectDialog, UpdateDialog } from '../../../components'
import { Provider, Belonging, MedicalGroup, UpdateProps } from '../../../types'
import { useAntdHelp, useAuth } from '../../../hooks'

import { CreateBelonging } from '../belonging/belonging-upsert.view'
import { subscription as belongingSubscription } from '../belonging/belonging.constant'
import { mutation, query } from './provider.constant'


interface IProviderCreateArgs {
	vendorCode:	string
	businessName:	string
	nit?:			string
	address?:		string
	phone?:		string

	belongingId:	number

	medicalGroups: Array<{
		medicalGroupId: number
		specialties:	Array<{
			medicalSpecialtyId: number
			subspecialties: Array<number>
		}>
	}>
}

interface IProviderDependencies {
	belongings: Array<Belonging>
	medicalGroups: Array<MedicalGroup>
	provider?: Provider
}

type ProviderFormProps = {
	mode: 'create' | 'update'
	data: IProviderDependencies
	onSubmit: (data: IProviderCreateArgs) => void
	onCancel: () => void
	onRefetch: () => void
}

function ProviderForm({ mode, data, onSubmit, onCancel, onRefetch }: ProviderFormProps) {
	const { provider } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { has } = useAuth()
	const { touched, encodeMedicalGroups, decodeMedicalGroups, formatMedicalGroups } = useAntdHelp()
	const onFinish = () => {
		const { medicalGroups, ...remaining } = touched(form)
		const payload = medicalGroups
			? { ...remaining, medicalGroups: decodeMedicalGroups(medicalGroups) }
			: { ...remaining }
		onSubmit(payload)
	}
	const format = (payload?: Provider) => {
		if (!payload) return undefined
		const { belonging, medicalGroups, ...remaining } = payload
		return {
			...remaining,
			belongingId: belonging.id,
			medicalGroups: formatMedicalGroups(medicalGroups)
		}
	}

	useSubscription(belongingSubscription.BELONGING_UPSERTED, { onData: onRefetch })

	const belongings = data ? data.belongings : []
		, medicalGroups = data ? encodeMedicalGroups(data.medicalGroups) : []

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={format(provider)}>
			<Item
				name='vendorCode'
				label='Código vendor'
				rules={[{ required: true, message: 'Escriba el código vendor del proveedor' }]}>
				<Input placeholder='Código vendor del proveedor' disabled={mode == 'update'}/>
			</Item>
			<Item
				name='businessName'
				label='Razón social'
				rules={[{ required: true, message: 'Escriba la razón social del proveedor' }]}>
				<Input placeholder='Razón social del proveedor'/>
			</Item>
			<Item name='belongingId'
				label='Pertinencia'
				rules={[{ required: true, message: 'Seleccione pertinencia' }]}>
				<Select
					placeholder='Pertinencia'
					options={belongings.map(t => ({ label: t.name, value: t.id }))}
					dropdownRender={menu => (
						<>
							{menu}
							{
								has('WriteBelonging', <>
									<Divider style={{ margin: '8px 0' }}/>
									<CreateBelonging/>
								</>)
							}
						</>
					)}/>
			</Item>
			<Item name='medicalGroups'
				label='Detalle de unidades, especialidades y servicios'>
				<TreeSelect treeCheckable={true} treeData={medicalGroups} placeholder='Detalle de unidades médicas'/>
			</Item>
			<Item
				name='nit'
				label='NIT'>
				<Input placeholder='NIT del proveedor'/>
			</Item>
			<Item
				name='address'
				label='Dirección'>
				<Input placeholder='Dirección del proveedor'/>
			</Item>
			<Item
				name='phone'
				label='Teléfono'>
				<Input placeholder='Teléfono del proveedor'/>
			</Item>
			
			<div className='modal-dialog-footer'>
				<Space>
					<Button type='default' onClick={onCancel}>Cancelar</Button>
					<Button type='primary' htmlType='submit'>Aceptar</Button>
				</Space>
			</div>
		</Form>
	)
}

export function CreateProvider() {
	return (
		<CreateDialog<IProviderCreateArgs, IProviderDependencies>
			title='Nuevo proveedor'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_PROVIDER}
			render={(submit, close, data, refetch) => <ProviderForm mode='create' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function UpdateProvider({ id }: UpdateProps) {
	return (
		<UpdateDialog<IProviderCreateArgs, IProviderDependencies>
			id={id}
			title='Editar proveedor'
			query={query.UPDATE_DEPENDENCIES}
			mutation={mutation.UPDATE_PROVIDER}
			render={(submit, close, data, refetch) => <ProviderForm mode='update' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function InspectProvider({ id }: UpdateProps) {
	return (
		<InspectDialog<{ provider: Provider }>
			id={id}
			title='Proveedor'
			render={({provider}) => <>
				<Card>
					<b>Código vendor: </b><div>{provider.vendorCode}</div>
					<b>Razón social: </b><div>{provider.businessName}</div>
				</Card>
				<Card>
					<b>Unidades y especialidades: </b>
					<Tree
						defaultExpandAll
						treeData={provider.medicalGroups.map((group: MedicalGroup) => ({
							key: `${id}-${group.id}`,
							title: group.name,
							children: group.specialties.map(specialty => ({
								key: `${id}-${group.id}-${specialty.id}`,
								title: specialty.name,
								children: specialty.subspecialties.map(sbsp => ({
									key: `${id}-${group.id}-${specialty.id}-${sbsp.id}`,
									title: sbsp.name
								}))
							}))
						}))}/>
				</Card>
			</>}
			query={query.PROVIDER}
		/>
	)
}
