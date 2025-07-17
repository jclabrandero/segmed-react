
import { useState } from 'react'
import { useSubscription } from '@apollo/client'
import { Button, Card, Checkbox, DatePicker, Divider, Form, Input, InputNumber, Select, Space } from 'antd'
import dayjs from 'dayjs'
import { UndoOutlined , StopOutlined } from '@ant-design/icons'
import { CreateDialog, DeleteDialog, InspectDialog, UpdateDialog } from '../../../components'
import { Person, Insured, Belonging, InsuredType, UpdateProps } from '../../../types'
import { useAntdHelp, useAuth } from '../../../hooks'

import { subscription as insuredTypeSubscription } from '../../catalog/insured-type/insured-type.constant'
import { subscription as belongingSubscription } from '../../reference/belonging/belonging.constant'
import { subscription as personSubscription } from '../person/person.constant'

import { CreatePerson } from '../person/person-upsert.view'
import { CreateInsuredType } from '../../catalog/insured-type/insured-type-upsert.view'
import { CreateBelonging } from '../../reference/belonging/belonging-upsert.view'

import { query, mutation } from './insured.constant'


interface IInsuredCreateArgs {
	iin?:		number
	inletDate?:	Date
	tradeUnion:	boolean
	address?:	string
	phone?:		string

	personId:			number
	insuredTypeId: 		number
	holderInsuredId?:	number
	belongingId:		number
}

interface IInsuredUpdateArgs {
	iin?:			number
	inletDate?:		Date
	outletDate?:	Date
	tradeUnion?:	boolean
	address?:		string
	phone?:			string

	personId?:			number
	insuredTypeId?: 	number
	holderInsuredId?:	number
	belongingId?:		number
}

interface IInsuredDependencies {
	people: Array<Person>
	holders: Array<Insured>
	insuredTypes: Array<InsuredType>
	belongings: Array<Belonging>
	insured?: Insured
}

type InsuredFormProps<TArgs> = {
	mode: 'create' | 'update'
	data: IInsuredDependencies
	onSubmit: (data: TArgs) => void
	onCancel: () => void
	onRefetch: () => void
}

function InsuredForm<TArgs>({ mode, data, onSubmit, onCancel, onRefetch }: InsuredFormProps<TArgs>) {
	const { insured } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { touched, selectFilter } = useAntdHelp()
		, { has } = useAuth()
	const [ selectedInsuredType, setSelectedInsuredType ] = useState<InsuredType | undefined>(insured ? insured.insuredType : undefined)
	const onFinish = () => onSubmit(touched(form))
	const format = (payload?: Insured) => {
		if (!payload) return { inletDate: dayjs() }
		const { person, inletDate, outletDate, insuredType, holderInsured, belonging, ...remaining } = payload
		return {
			...remaining,
			inletDate: dayjs(inletDate),
			outletDate: outletDate ? dayjs(outletDate) : undefined,
			personId: person.id,
			insuredTypeId: insuredType.id,
			holderInsuredId: holderInsured?.id,
			belongingId: belonging.id
		}
	}

	useSubscription(insuredTypeSubscription.INSURED_TYPE_UPSERTED, { onData: onRefetch })
	useSubscription(belongingSubscription.BELONGING_UPSERTED, { onData: onRefetch })
	useSubscription(personSubscription.PERSON_UPSERTED, { onData: onRefetch })

	const people = data ? data.people : []
		, holders = data ? data.holders : []
		, insuredTypes = data ? data.insuredTypes : []
		, belongings = data ? data.belongings : []

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={format(insured)}>
			{
				mode == 'update' &&
				<Item
					name='code'
					label='Código de beneficiario'
					rules={[{ required: true, message: 'Escriba el código de beneficiario' }]}>
					<Input disabled={true}/>
				</Item>
			}
			<Item
				name='inletDate'
				label='Fecha de alta'
				rules={[{ required: true, message: 'Seleccione fecha de alta' }]}>
				<DatePicker format='DD/MM/YYYY'/>
			</Item>
			{
				mode == 'update' &&
				<Item
					name='outletDate'
					label='Fecha de baja'>
					<DatePicker format='DD/MM/YYYY' minDate={dayjs()}/>
				</Item>
			}
			<Item name='personId'
				label='Datos de persona'
				rules={[{ required: true, message: 'Seleccione datos de persona' }]}>
				<Select
					options={people.map(p => ({ label: `${p.firstName} ${p.lastName}`, value: p.id }))}
					showSearch={true}
					filterOption={selectFilter}
					placeholder='Datos de persona'
					dropdownRender={menu => (
						<>
							{menu}
							{
								has('WritePerson', <>
									<Divider style={{ margin: '8px 0' }}/>
									<CreatePerson/>
								</>)
							}
						</>
					)}/>
			</Item>
			<Item name='insuredTypeId'
				label='Tipo de beneficiario'
				rules={[{ required: true, message: 'Seleccione el tipo de beneficiario' }]}>
				<Select
					placeholder='Tipo de beneficiario'
					options={insuredTypes.map(t => ({ label: t.name, value: t.id }))}
					onChange={(value: number) => setSelectedInsuredType(insuredTypes.find(t => t.id == value))}
					dropdownRender={menu => (
						<>
							{menu}
							{
								has('WriteInsuredType', <>
									<Divider style={{ margin: '8px 0' }}/>
									<CreateInsuredType/>
								</>)
							}
						</>
					)}/>
			</Item>
			{
				selectedInsuredType && ((selectedInsuredType.withDependents == false)
					? (
						<>
							<Item name='holderInsuredId'
								label='Beneficiario titular'>
								<Select
									placeholder='Beneficiario titular'
									options={holders.map(h => ({ label: `${h.person.firstName} ${h.person.lastName}`, value: h.id }))}
									showSearch={true}
									filterOption={selectFilter}
								/>
							</Item>
						</>
					)
					: (
						<>
							<Item
								name='iin'
								label='Ficha'
								rules={[{ required: true, message: 'Escriba ficha del beneficiario' }]}>
								<InputNumber min={1}/>
							</Item>
							<Item name='tradeUnion' valuePropName='checked'>
								<Checkbox>Sindical</Checkbox>
							</Item>
						</>
					))
			}
			
			<Item name='belongingId'
				label='Pertinencia'
				rules={[{ required: true, message: 'Seleccione pertinencia' }]}>
				<Select
					placeholder='Pertinencia'
					options={belongings.map(b => ({ label: b.name, value: b.id }))}
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
			<Item
				name='address'
				label='Dirección'>
				<Input/>
			</Item>
			<Item
				name='phone'
				label='Teléfono'>
				<Input/>
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

export function CreateInsured() {
	return (
		<CreateDialog<IInsuredCreateArgs, IInsuredDependencies>
			title='Nuevo beneficiario'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_INSURED}
			render={(submit, close, data, refetch) => <InsuredForm mode='create' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function UpdateInsured({ id }: UpdateProps) {
	return (
		<UpdateDialog<IInsuredUpdateArgs, IInsuredDependencies>
			id={id}
			title='Editar beneficiario'
			query={query.UPDATE_DEPENDENCIES}
			mutation={mutation.UPDATE_INSURED}
			render={(submit, close, data, refetch) => <InsuredForm mode='update' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function DeleteInsured({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ insured: Insured }>
			id={id}
			title='Eliminar beneficiario'
			render={({ insured }) => `datos del beneficiario: ${insured.person.firstName} ${insured.person.lastName}`}
			query={query.INSURED}
			mutation={mutation.DELETE_INSURED}
		/>
	)
}

export function InspectInsured({ id }: UpdateProps) {
	return (
		<InspectDialog<{ insured: Insured }>
			id={id}
			title='Datos de beneficiario'
			render={({insured}) => <>
				<Card>
					<b>Nombre: </b><div>{insured.person.firstName} {insured.person.lastName}</div>
				</Card>
			</>}
			query={query.INSURED}
		/>
	)
}

export function UpgradeInsured({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ insured: Insured }>
			id={id}
			title='Activar beneficiario'
			icon={<UndoOutlined style={{ color: 'blue' }}/>}
			renderExt={({ insured }) => `Rehabilitar a: ${insured.person.firstName} ${insured.person.lastName}`}
			confirmButtonText={'Activar'}
			query={query.INSURED}
			mutation={mutation.UPGRADE_INSURED}
		/>
	)
}

export function DowngradeInsured({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ insured: Insured }>
			id={id}
			title='Inactivar beneficiario'
			icon={<StopOutlined style={{ color: 'orange' }}/>}
			renderExt={({ insured }) => `Deshabilitar a: ${insured.person.firstName} ${insured.person.lastName}`}
			confirmButtonText={'Inactivar'}
			query={query.INSURED}
			mutation={mutation.DOWNGRADE_INSURED}
		/>
	)
}
