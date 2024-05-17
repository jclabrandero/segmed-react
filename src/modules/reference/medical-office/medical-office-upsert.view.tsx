
import { useSubscription } from '@apollo/client'
import { Button, Card, Divider, Form, Input, Select, Space } from 'antd'

import { CreateDialog, DeleteDialog, InspectDialog, UpdateDialog } from '../../../components'
import { useAntdHelp, useAuth } from '../../../hooks'
import { Belonging, MedicalOffice, UpdateProps } from '../../../types'

import { CreateBelonging } from '../belonging/belonging-upsert.view'
import { subscription as BelongingSubscription } from '../belonging/belonging.constant'
import { mutation, query } from './medical-office.constant'


interface IMedicalOfficeCreateArgs {
	name:			string
	belongingId:	number
}

interface IMedicalOfficeDependencies {
	medicalOffice?:	MedicalOffice
	belongings:		Array<Belonging>
}

type MedicalOfficeFormProps = {
	mode: 'create' | 'update'
	data: IMedicalOfficeDependencies
	onSubmit: (data: IMedicalOfficeCreateArgs) => void
	onCancel: () => void
	onRefetch: () => void
}

function MedicalOfficeForm({ data, onSubmit, onCancel, onRefetch }: MedicalOfficeFormProps) {
	const { medicalOffice } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { touched } = useAntdHelp()
		, { has } = useAuth()
	const onFinish = () => onSubmit(touched(form))
	const format = (payload?: MedicalOffice) => {
		if (!payload) return undefined
		const { belonging, ...remaining } = payload
		return { ...remaining, belongingId: belonging.id }
	}
	const belongings = data ? data.belongings : []

	useSubscription(BelongingSubscription.BELONGING_UPSERTED, { onData: onRefetch })

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={format(medicalOffice)}>
			<Item
				name='name'
				label='Nombre'
				rules={[{ required: true, message: 'Escriba el nombre' }]}>
				<Input placeholder='Nombre'/>
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
			<div className='modal-dialog-footer'>
				<Space>
					<Button type='default' onClick={onCancel}>Cancelar</Button>
					<Button type='primary' htmlType='submit'>Aceptar</Button>
				</Space>
			</div>
		</Form>
	)
}

export function CreateMedicalOffice() {
	return (
		<CreateDialog<IMedicalOfficeCreateArgs, IMedicalOfficeDependencies>
			title='Nuevo consultorio'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_MEDICAL_OFFICE}
			render={(submit, close, data, refetch) => <MedicalOfficeForm mode='create' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function UpdateMedicalOffice({ id }: UpdateProps) {
	return (
		<UpdateDialog<IMedicalOfficeCreateArgs, IMedicalOfficeDependencies>
			id={id}
			title='Editar consultorio'
			query={query.UPDATE_DEPENDENCIES}
			mutation={mutation.UPDATE_MEDICAL_OFFICE}
			render={(submit, close, data, refetch) => <MedicalOfficeForm mode='update' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function DeleteMedicalOffice({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ medicalOffice: MedicalOffice }>
			id={id}
			title='Eliminar consultorio'
			render={({ medicalOffice }) => `el consultorio: ${medicalOffice.name}`}
			query={query.MEDICAL_OFFICE}
			mutation={mutation.DELETE_MEDICAL_OFFICE}
		/>
	)
}

export function InspectMedicalOffice({ id }: UpdateProps) {
	return (
		<InspectDialog<{ medicalOffice: MedicalOffice }>
			id={id}
			title='Consultorio'
			render={({medicalOffice}) => <>
				<Card>
					<b>Nombre: </b><div>{medicalOffice.name}</div>
				</Card>
			</>}
			query={query.MEDICAL_OFFICE}
		/>
	)
}
