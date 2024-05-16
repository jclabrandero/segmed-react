
import { useSubscription } from '@apollo/client'
import { Button, Card, Divider, Form, Input, Space, TreeSelect } from 'antd'

import { CreateDialog, DeleteDialog, InspectDialog, UpdateDialog } from '../../../components'
import { MedicalGroup, MedicalSpecialty, UpdateProps } from '../../../types'
import { useAuth } from '../../../hooks'

import { CreateMedicalSpecialty } from '../medical-specialty/medical-specialty-upsert.view'
import { subscription as medicalSpecialtySubscription } from '../medical-specialty/medical-specialty.constant'
import { mutation, query } from './medical-group.constant'


interface IMedicalGroupCreateArgs {
	name:			string
	description?:	string
}

interface IMedicalGroupDependencies {
	specialties: Array<MedicalSpecialty>
	medicalGroup?: MedicalGroup
}

type MedicalGroupFormProps = {
	mode: 'create' | 'update'
	data: IMedicalGroupDependencies
	onSubmit: (data: IMedicalGroupCreateArgs) => void
	onCancel: () => void
	onRefetch: () => void
}

function MedicalGroupForm({ data, onSubmit, onCancel, onRefetch }: MedicalGroupFormProps) {
	const { medicalGroup } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { has } = useAuth()
	const onFinish = () => onSubmit(form.getFieldsValue({ filter: (meta) => meta.touched }))
	const format = (payload?: MedicalGroup) => {
		if (!payload) return undefined
		const { specialties, ...remaining } = payload
		return { ...remaining, specialties: specialties.map(sp => sp.id) }
	}
	useSubscription(medicalSpecialtySubscription.MEDICAL_SPECIALTY_UPSERTED, { onData: onRefetch })

	const specialties = data ? data.specialties : []

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={format(medicalGroup)}>
			<Item
				name='name'
				label='Nombre'
				rules={[{ required: true, message: 'Escriba el nombre' }]}>
				<Input placeholder='Nombre'/>
			</Item>
			<Item
				name='description'
				label='Descripción'>
				<Input placeholder='Descripción'/>
			</Item>
			<Item name='specialties'
				label='Especialidades médicas'>
				<TreeSelect
					treeCheckable={true}
					dropdownRender={(menu) => (
						<>
							{menu}
							{
								has('WriteMedicalSpecialty', <>
									<Divider style={{ margin: '8px 0' }}/>
									<CreateMedicalSpecialty/>
								</>)
							}
						</>
					)}
					treeData={specialties.map(rec => ({ title: rec.name, value: rec.id }))}/>
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

export function CreateMedicalGroup() {
	return (
		<CreateDialog<IMedicalGroupCreateArgs, IMedicalGroupDependencies>
			title='Nueva unidad médica'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_MEDICAL_GROUP}
			render={(submit, close, data, refetch) => <MedicalGroupForm mode='create' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function UpdateMedicalGroup({ id }: UpdateProps) {
	return (
		<UpdateDialog<IMedicalGroupCreateArgs, IMedicalGroupDependencies>
			id={id}
			title='Editar unidad médica'
			query={query.UPDATE_DEPENDENCIES}
			mutation={mutation.UPDATE_MEDICAL_GROUP}
			render={(submit, close, data, refetch) => <MedicalGroupForm mode='update' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function DeleteMedicalGroup({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ medicalGroup: MedicalGroup }>
			id={id}
			title='Eliminar unidad médica'
			render={({medicalGroup}) => `la unidad médica: ${medicalGroup.name}`}
			query={query.MEDICAL_GROUP}
			mutation={mutation.DELETE_MEDICAL_GROUP}
		/>
	)
}

export function InspectMedicalGroup({ id }: UpdateProps) {
	return (
		<InspectDialog<{ medicalGroup: MedicalGroup }>
			id={id}
			title='Sub-especialidad médica'
			render={({medicalGroup}) => <>
				<Card>
					<b>Nombre: </b><div>{medicalGroup.name}</div>
				</Card>
			</>}
			query={query.MEDICAL_GROUP}
		/>
	)
}
