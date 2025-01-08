
import { useState } from 'react'
import { useQuery, useSubscription } from '@apollo/client'
import { Button, Form, Input, InputNumber, Space, Select, DatePicker, Spin } from 'antd'

import { CreateDialog } from '../../../components'
import { Departure, Inventory, Batch } from '../../../types'
import { useAntdHelp } from '../../../hooks'
import { subscription as batchSubscription } from '../batch/batch.constant'

import { mutation, query } from './inventory.constant'

interface IDepartureCreateArgs {
	remark:			string
	departureDate:	Date
	pharmacyId:		boolean
}

interface IDepartureDependencies {
	pharmacyId?:	number
	departure?:		Departure
}

type DepartureFormProps = {
	mode: 'create' | 'update'
	data: IDepartureDependencies
	onSubmit: (data: IDepartureCreateArgs) => void
	onCancel: () => void
}

function DepartureForm({ mode, data, onSubmit, onCancel }: DepartureFormProps) {
	const { departure, pharmacyId } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { touched } = useAntdHelp()
	const onFinish = () => {
		const payload = touched(form)
		if (mode == 'create') onSubmit({ pharmacyId, ...payload })
	}

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={departure}>
			<Item
				name='remark'
				label='Observación'
				rules={[{ required: true, message: 'Escriba la observación' }]}>
				<Input/>
			</Item>
			<Item
				name='departureDate'
				label='Fecha de salida'
				rules={[{ required: true, message: 'Seleccione fecha de salida' }]}>
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

export function CreateDeparture({ pharmacyId }: { pharmacyId: number }) {
	return (
		<CreateDialog<IDepartureCreateArgs, IDepartureDependencies>
			title='Nueva salida'
			mutation={mutation.CREATE_DEPARTURE}
			render={(submit, close) => <DepartureForm mode='create' data={{ pharmacyId }} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

interface IDepartureItemCreateArgs {
	quantity:		number
	batchId:		number
	departureId:	number
}

interface IDepartureItemDependencies {
	inventories:	Array<Inventory>
}

type DepartureItemFormProps = {
	mode: 'create' | 'update'
	data: IDepartureItemDependencies
	onSubmit: (data: IDepartureItemCreateArgs) => void
	onCancel: () => void
	onRefetch: () => void
	pharmacyId:		number
	departureId:	number
}

function MedicationBatch({ pharmacyId, medicationId }: { pharmacyId: number; medicationId: number }) {
	const { Item } = Form
		, { map, selectFilter } = useAntdHelp()
		, variables = { data: { pharmacyId, medicationId } }
		, { loading, data } = useQuery(query.BATCHES_STOCK, { variables, fetchPolicy: 'network-only' })

	if (loading) return <Spin/>

	return (
		<Item name='batchId' label='Lote' rules={[{ required: true, message: 'Seleccione el lote' }]}>
			<Select
				options={map(data?.batchesStocks, ({ batch, stock }: { batch: Batch, stock: number }) => {
					return {
						label: `${batch.code} - (stock: ${stock})`,
						value: batch.id
					}
				})}
				showSearch={true}
				filterOption={selectFilter}
				placeholder='Número de lote'
			/>
		</Item>
	)
}

function DepartureItemForm({ mode, data, onSubmit, onCancel, onRefetch, pharmacyId, departureId }: DepartureItemFormProps) {
	const { inventories } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { touched, map, selectFilter } = useAntdHelp()
		, [ medicationId, setMedicationId ] = useState(0)
	const onFinish = () => {
		const payload = touched(form)
		if (mode == 'create') onSubmit({ departureId, ...payload })
	}

	useSubscription(batchSubscription.BATCH_UPSERTED, { onData: onRefetch })

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish}>
			<Item label='Medicamento'>
				<Select
					options={map(inventories, (inventory: Inventory) => {
						const { code, name, concentration, unit} = inventory.medication
						return {
							label: `${code} - ${name} - ${concentration} - ${unit.name}`,
							value: inventory.medication.id
						}
					})}
					showSearch={true}
					filterOption={selectFilter}
					placeholder='Medicamento'
					onChange={(value) => {
						form.setFieldValue('batchId', null)
						setMedicationId(value)}
					}
				/>
			</Item>
			{
				medicationId != 0 &&
				<MedicationBatch pharmacyId={pharmacyId} medicationId={medicationId}/>
			}
			<Item
				name='quantity'
				label='Cantidad'
				rules={[{ required: true, message: 'Escriba la cantidad' }]}>
				<InputNumber min='1'/>
			</Item>
			{/* <Item
				name='price'
				label='Precio'
				rules={[{ required: true, message: 'Escriba el precio' }]}>
				<InputNumber readOnly
					min='0'
					step='0.01'/>
			</Item> */}
			<div className='modal-dialog-footer'>
				<Space>
					<Button type='default' onClick={onCancel}>Cancelar</Button>
					<Button type='primary' htmlType='submit'>Aceptar</Button>
				</Space>
			</div>
		</Form>
	)
}

export function CreateDepartureItem({ departureId, pharmacyId }: { departureId: number, pharmacyId: number }) {
	return (
		<CreateDialog<IDepartureItemCreateArgs, IDepartureItemDependencies>
			title='Crear ítem'
			query={query.INVENTORIES}
			options={{ variables: { pharmacyId } }}
			mutation={mutation.CREATE_DEPARTURE_ITEM}
			render={(submit, close, data, refetch) => <DepartureItemForm mode='create' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch} pharmacyId={pharmacyId} departureId={departureId}/>}
		/>
	)
}
