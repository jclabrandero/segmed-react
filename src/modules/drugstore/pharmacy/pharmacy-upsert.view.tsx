
import { useSubscription } from '@apollo/client'
import { Button, Card, Divider, Form, Input, Select, Space } from 'antd'

import { CreateDialog, InspectDialog, UpdateDialog } from '../../../components'
import { Belonging, Pharmacy, UpdateProps } from '../../../types'
import { useAntdHelp, useAuth } from '../../../hooks'

import { CreateBelonging } from '../../reference/belonging/belonging-upsert.view'
import { subscription as belongingSubscription } from '../../reference/belonging/belonging.constant'

import { mutation, query } from './pharmacy.constant'


interface IPharmacyCreateArgs {
	name:			string
	belongingId:	number
}

interface IPharmacyDependencies {
	belongings: Array<Belonging>

	pharmacy?: Pharmacy
}

type PharmacyFormProps = {
	mode: 'create' | 'update'
	data: IPharmacyDependencies
	onSubmit: (data: IPharmacyCreateArgs) => void
	onCancel: () => void
	onRefetch: () => void
}

function PharmacyForm({ data, onSubmit, onCancel, onRefetch }: PharmacyFormProps) {
	const { pharmacy } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { touched, map, toLV } = useAntdHelp()
		, { has } = useAuth()
	const onFinish = () => onSubmit(touched(form))
	const format = (payload?: Pharmacy) => {
		if (!payload) return undefined
		const { belonging, ...remaining } = payload
		return {
			...remaining,
			belongingId: belonging.id
		}
	}

	useSubscription(belongingSubscription.BELONGING_UPSERTED, { onData: onRefetch })

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={format(pharmacy)}>
			<Item
				name='name'
				label='Nombre de la farmacia'
				rules={[{ required: true, message: 'Escriba el nombre de la farmacia' }]}>
				<Input/>
			</Item>
			<Item name='belongingId'
				label='Pertinencia'
				rules={[{ required: true, message: 'Seleccione pertinencia' }]}>
				<Select
					placeholder='Pertinencia'
					options={map(data.belongings, toLV)}
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
			<div className='modal-dialog-footer'>
				<Space>
					<Button type='default' onClick={onCancel}>Cancelar</Button>
					<Button type='primary' htmlType='submit'>Aceptar</Button>
				</Space>
			</div>
		</Form>
	)
}

export function CreatePharmacy() {
	return (
		<CreateDialog<IPharmacyCreateArgs, IPharmacyDependencies>
			title='Nueva farmacia'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_PHARMACY}
			render={(submit, close, data, refetch) => <PharmacyForm mode='create' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function UpdatePharmacy({ id }: UpdateProps) {
	return (
		<UpdateDialog<IPharmacyCreateArgs, IPharmacyDependencies>
			id={id}
			title='Editar proveedor'
			query={query.UPDATE_DEPENDENCIES}
			mutation={mutation.UPDATE_PHARMACY}
			render={(submit, close, data, refetch) => <PharmacyForm mode='update' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function InspectPharmacy({ id }: UpdateProps) {
	return (
		<InspectDialog<{ pharmacy: Pharmacy }>
			id={id}
			title='Farmacia'
			render={({pharmacy}) => <>
				<Card>
					<b>Nombre: </b><div>{pharmacy.name}</div>
				</Card>
			</>}
			query={query.PHARMACY}
		/>
	)
}
