
import { useSubscription } from '@apollo/client'
import { Button, Form, Input, InputNumber, Space, Select, DatePicker, Divider } from 'antd'

import { CreateDialog } from '../../../components'
import { Arrival, Batch, Provider } from '../../../types'
import { useAntdHelp, useAuth } from '../../../hooks'
import { CreateBatch } from '../batch/batch-upsert.view'
import { subscription as batchSubscription } from '../batch/batch.constant'

import { mutation, query } from './inventory.constant'

interface IArrivalCreateArgs {
	remark:			string
	arrivalDate:	Date
	invoiceNumber:				number
	invoiceAuthorizationCode?:	string
	invoiceControlCode?:		string

	pharmacyId:		boolean
	providerId?:	number
}

interface IArrivalDependencies {
	providers:		Array<Provider>
	pharmacyId?:	number
	arrival?:		Arrival
}

type ArrivalFormProps = {
	mode: 'create' | 'update'
	data: IArrivalDependencies
	onSubmit: (data: IArrivalCreateArgs) => void
	onCancel: () => void
}

function ArrivalForm({ mode, data, onSubmit, onCancel }: ArrivalFormProps) {
	const { providers, arrival, pharmacyId } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { touched, selectFilter, map } = useAntdHelp()
	const onFinish = () => {
		const payload = touched(form)
		if (mode == 'create') onSubmit({ pharmacyId, ...payload })
	}

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={arrival}>
			<Item
				name='remark'
				label='Descripción'
				rules={[{ required: true, message: 'Escriba la descripción' }]}>
				<Input/>
			</Item>
			<Item name='providerId' label='Proveedor' rules={[{ required: true, message: 'Seleccione el proveedor' }]}>
				<Select
					options={map(providers, (provider) => {
						return {
							label: `${provider.businessName} ${provider.nit ? `- NIT: ${provider.nit}` : ''}`,
							value: provider.id
						}
					})}
					showSearch={true}
					filterOption={selectFilter}
					placeholder='Proveedor'
				/>
			</Item>
			<Item
				name='invoiceNumber'
				label='Número de factura'
				rules={[{ required: true, message: 'Escriba el número de factura' }]}>
				<InputNumber/>
			</Item>
			<Item
				name='invoiceAuthorizationCode'
				label='Código de autorización de la factura'>
				<Input/>
			</Item>
			<Item
				name='invoiceControlCode'
				label='Código de control de la factura'>
				<Input/>
			</Item>
			<Item
				name='arrivalDate'
				label='Fecha de ingreso'
				rules={[{ required: true, message: 'Seleccione fecha de ingreso' }]}>
				<DatePicker format='DD/MM/YYYY'/>
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

export function CreateArrival({ pharmacyId }: { pharmacyId: number }) {
	return (
		<CreateDialog<IArrivalCreateArgs, IArrivalDependencies>
			title='Nuevo ingreso'
			query={query.CREATE_ARRIVAL_DEPENDENCIES}
			options={{ variables: { query: {} } }}
			mutation={mutation.CREATE_ARRIVAL}
			render={(submit, close, data) => <ArrivalForm mode='create' data={{ pharmacyId, ...data }} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

interface IArrivalItemCreateArgs {
	quantity:	number
	price:		number
	batchId:	number
	arrivalId:	number
}

interface IArrivalItemDependencies {
	batches: Array<Batch>
	arrivalId?:	number
}

type ArrivalItemFormProps = {
	mode: 'create' | 'update'
	data: IArrivalItemDependencies
	onSubmit: (data: IArrivalItemCreateArgs) => void
	onCancel: () => void
	onRefetch: () => void
}

function ArrivalItemForm({ mode, data, onSubmit, onCancel, onRefetch }: ArrivalItemFormProps) {
	const { arrivalId, batches } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { touched, map, selectFilter } = useAntdHelp()
		, { has } = useAuth()
	const onFinish = () => {
		const payload = touched(form)
		if (mode == 'create') onSubmit({ arrivalId, ...payload })
	}

	useSubscription(batchSubscription.BATCH_UPSERTED, { onData: onRefetch })

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish}>
			<Item name='batchId' label='Lote' rules={[{ required: true, message: 'Seleccione el lote' }]}>
				<Select
					options={map(batches, (batch: Batch) => {
						const { code, name, concentration, unit} = batch.medication
						return {
							label: `${batch.code} - ${code} - ${name} - ${concentration} - ${unit.name}`,
							value: batch.id
						}
					})}
					showSearch={true}
					filterOption={selectFilter}
					placeholder='Número de lote'
					dropdownRender={menu => (
						<>
							{menu}
							{
								has('WriteBatch', <>
									<Divider style={{ margin: '8px 0' }}/>
									<CreateBatch/>
								</>)
							}
						</>
					)}
				/>
			</Item>
			<Item
				name='quantity'
				label='Cantidad'
				rules={[{ required: true, message: 'Escriba la cantidad' }]}>
				<InputNumber min='1'/>
			</Item>
			<Item
				name='price'
				label='Precio'
				rules={[{ required: true, message: 'Escriba el precio' }]}>
				<InputNumber
					min='0'
					step='0.01'/>
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

export function CreateArrivalItem({ arrivalId }: { arrivalId: number }) {
	return (
		<CreateDialog<IArrivalItemCreateArgs, IArrivalItemDependencies>
			title='Agregar nuevo item'
			buttonSize='small'
			query={query.CREATE_ARRIVAL_ITEM_DEPENDENCIES}
			mutation={mutation.CREATE_ARRIVAL_ITEM}
			render={(submit, close, data, refetch) => <ArrivalItemForm mode='create' data={{ arrivalId, ...data }} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}
