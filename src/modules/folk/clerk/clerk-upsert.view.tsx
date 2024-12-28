
import { useSubscription } from '@apollo/client'
import { Button, Card, Divider, Form, InputNumber, Select, Space, TreeSelect } from 'antd'

import { CreateDialog, DeleteDialog, InspectDialog, UpdateDialog } from '../../../components'
import { useAntdHelp, useAuth } from '../../../hooks'
import { EmployeePosition, EmployeeType, MedicalOffice, Person, Clerk, UpdateProps } from '../../../types'

import { CreatePerson } from '../person/person-upsert.view'
import { CreateEmployeePosition } from '../../catalog/employee-position/employee-position-upsert.view'
import { CreateEmployeeType } from '../../catalog/employee-type/employee-type-upsert.view'
import { CreateMedicalOffice } from '../../reference/medical-office/medical-office-upsert.view'
import { subscription as personSubscription } from '../person/person.constant'
import { subscription as employeePositionSubscription } from '../../catalog/employee-position/employee-position.constant'
import { subscription as employeeTypeSubscription } from '../../catalog/employee-type/employee-type.constant'
import { subscription as medicalOfficeSubscription } from '../../reference/medical-office/medical-office.constant'

import { query, mutation } from './clerk.constant'


interface IClerkCreateArgs {
	ein:				number

	personId:			number
	positionId:			number
	employeeTypeId:		number

	offices?:			Array<number>
	medicalOffices?:	Array<number>
}

interface IClerkDependencies {
	people:				Array<Person>
	employeePositions:	Array<EmployeePosition>
	employeeTypes:		Array<EmployeeType>
	medicalOffices:		Array<MedicalOffice>
	clerk?:				Clerk
}

type ClerkFormProps = {
	mode:		'create' | 'update'
	data:		IClerkDependencies
	onSubmit:	(data: IClerkCreateArgs) => void
	onCancel:	() => void
	onRefetch:	() => void
}

function ClerkForm({ mode, data, onSubmit, onCancel, onRefetch }: ClerkFormProps) {
	const { clerk } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { touched, selectFilter } = useAntdHelp()
		, { has } = useAuth()
	const onFinish = () => onSubmit(touched(form))
	const format = (payload?: Clerk) => {
		if (!payload) return undefined
		const { person, position, employeeType, medicalOffices, ...remaining } = payload
		return { ...remaining, personId: person.id, positionId: position.id, employeeTypeId: employeeType.id, medicalOffices: medicalOffices.map(mo => mo.id) }
	}

	useSubscription(personSubscription.PERSON_UPSERTED, { onData: onRefetch })
	useSubscription(employeePositionSubscription.EMPLOYEE_POSITION_UPSERTED, { onData: onRefetch })
	useSubscription(employeeTypeSubscription.EMPLOYEE_TYPE_UPSERTED, { onData: onRefetch })
	useSubscription(medicalOfficeSubscription.MEDICAL_OFFICE_UPSERTED, { onData: onRefetch })

	const people = data ? data.people : []
		, employeePositions = data ? data.employeePositions : []
		, employeeTypes = data ? data.employeeTypes : []
		, medicalOffices = data ? data.medicalOffices : []

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={format(clerk)}>
			<Item
				name='ein'
				label='Ficha'
				rules={[{ required: true, message: 'Escriba el número de ficha' }]}>
				<InputNumber min={1} disabled={mode == 'update'}/>
			</Item>
			<Item name='personId'
				label='Datos de persona'
				rules={[{ required: true, message: 'Seleccione datos de persona' }]}>
				<Select
					placeholder='Datos de persona'
					options={people.map(p => ({ label: `${p.firstName} ${p.lastName}`, value: p.id }))}
					showSearch={true}
					filterOption={selectFilter}
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
			<Item name='employeeTypeId'
				label='Tipo de funcionario'
				rules={[{ required: true, message: 'Seleccione el tipo de funcionario' }]}>
				<Select
					placeholder='Tipo de funcionario'
					options={employeeTypes.map(t => ({ label: t.name, value: t.id }))}
					dropdownRender={menu => (
						<>
							{menu}
							{
								has('WriteEmployeeType', <>
									<Divider style={{ margin: '8px 0' }}/>
									<CreateEmployeeType/>
								</>)
							}
						</>
					)}/>
			</Item>
			<Item name='positionId'
				label='Cargo del funcionario'
				rules={[{ required: true, message: 'Seleccione el cargo del funcionario' }]}>
				<Select
					placeholder='Cargo del funcionario'
					options={employeePositions.map(pos => ({ label: pos.name, value: pos.id }))}
					dropdownRender={menu => (
						<>
							{menu}
							{
								has('WriteEmployeePosition', <>
									<Divider style={{ margin: '8px 0' }}/>
									<CreateEmployeePosition/>
								</>)
							}
						</>
					)}/>
			</Item>
			<Item name='offices'
				label='Oficinas'>
				<TreeSelect treeCheckable={true}/>
			</Item>
			<Item name='medicalOffices'
				label='Consultorios'>
				<TreeSelect
					treeCheckable={true}
					treeData={medicalOffices.map(mo => ({ title: mo.name, value: mo.id }))}
					dropdownRender={menu => (
						<>
							{menu}
							{
								has('WriteMedicalOffice', <>
									<Divider style={{ margin: '8px 0' }}/>
									<CreateMedicalOffice/>
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

export function CreateClerk() {
	return (
		<CreateDialog<IClerkCreateArgs, IClerkDependencies>
			title='Nuevo funcionario'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_CLERK}
			render={(submit, close, data, refetch) => <ClerkForm mode='create' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function UpdateClerk({ id }: UpdateProps) {
	return (
		<UpdateDialog<IClerkCreateArgs, IClerkDependencies>
			id={id}
			title='Editar funcionario'
			query={query.UPDATE_DEPENDENCIES}
			mutation={mutation.UPDATE_CLERK}
			render={(submit, close, data, refetch) => <ClerkForm mode='update' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function DeleteClerk({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ clerk: Clerk }>
			id={id}
			title='Eliminar datos de funcionario'
			render={({clerk}) => `el funcionario: ${clerk.person.firstName} ${clerk.person.lastName}`}
			query={query.CLERK}
			mutation={mutation.DELETE_CLERK}
		/>
	)
}

export function InspectClerk({ id }: UpdateProps) {
	return (
		<InspectDialog<{ clerk: Clerk }>
			id={id}
			title='Datos de funcionario'
			render={({clerk}) => <>
				<Card>
					<b>Nombre: </b><div>{clerk.person.firstName} {clerk.person.lastName}</div>
				</Card>
			</>}
			query={query.CLERK}
		/>
	)
}
