
import { useSubscription } from '@apollo/client'
import { Button, Form, Input, InputNumber, Space, Select, DatePicker, Divider } from 'antd'

import { CreateDialog } from '../../../components'
import { Arrival, Batch } from '../../../types'
import { useAntdHelp, useAuth } from '../../../hooks'
import { CreateBatch } from '../batch/batch-upsert.view'
import { subscription as batchSubscription } from '../batch/batch.constant'

import { mutation, query } from './inventory.constant'

interface IArrivalCreateArgs {
	remark:			string
	arrivalDate:	Date
	pharmacyId:		boolean
}

interface IArrivalDependencies {
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
	const { arrival, pharmacyId } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { touched } = useAntdHelp()
	const onFinish = () => {
		const payload = touched(form)
		if (mode == 'create') onSubmit({ pharmacyId, ...payload })
	}

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={arrival}>
			<Item
				name='remark'
				label='Observación'
				rules={[{ required: true, message: 'Escriba la observación' }]}>
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
			mutation={mutation.CREATE_ARRIVAL}
			render={(submit, close) => <ArrivalForm mode='create' data={{ pharmacyId }} onSubmit={submit} onCancel={close}/>}
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
		, { touched, map } = useAntdHelp()
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
			title=''
			query={query.CREATE_ARRIVAL_ITEM_DEPENDENCIES}
			mutation={mutation.CREATE_ARRIVAL_ITEM}
			render={(submit, close, data, refetch) => <ArrivalItemForm mode='create' data={{ arrivalId, ...data }} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}
