
import { useSubscription } from '@apollo/client'
import { Button, Card, Divider, Form, Input, Space, TreeSelect } from 'antd'

import { CreateDialog, DeleteDialog, InspectDialog, UpdateDialog } from '../../../components'
import { MedicalSpecialty, MedicalSubspecialty, UpdateProps } from '../../../types'
import { useAuth } from '../../../hooks'

import { CreateMedicalSubspecialty } from '../medical-subspecialty/medical-subspecialty-upsert.view'
import { subscription as medicalSubspecialtySubscription } from '../medical-subspecialty/medical-subspecialty.constant'

import { mutation, query } from './medical-specialty.constant'


interface IMedicalSpecialtyCreateArgs {
	name:				string
	description?:		string
	subspecialties?:	Array<number>
}

interface IMedicalSpecialtyDependencies {
	subspecialties: Array<MedicalSubspecialty>
	medicalSpecialty?: MedicalSpecialty
}

type MedicalSpecialtyFormProps = {
	mode: 'create' | 'update'
	data: IMedicalSpecialtyDependencies
	onSubmit: (data: IMedicalSpecialtyCreateArgs) => void
	onCancel: () => void
	onRefetch: () => void
}

function MedicalSpecialtyForm({ data, onSubmit, onCancel, onRefetch }: MedicalSpecialtyFormProps) {
	const { medicalSpecialty } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { has } = useAuth()
	const onFinish = () => onSubmit(form.getFieldsValue({ filter: (meta) => meta.touched }))
	const format = (payload?: MedicalSpecialty) => {
		if (!payload) return undefined
		const { subspecialties, ...remaining } = payload
		return { ...remaining, subspecialties: subspecialties.map(sbsp => sbsp.id) }
	}
	useSubscription(medicalSubspecialtySubscription.MEDICAL_SUBSPECIALTY_UPSERTED, { onData: onRefetch })

	const subspecialties = data ? data.subspecialties : []

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={format(medicalSpecialty)}>
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
			<Item name='subspecialties'
				label='Sub-especialidades'>
				<TreeSelect
					treeCheckable={true}
					dropdownRender={(menu) => (
						<>
							{menu}
							{
								has('WriteMedicalSubspecialty', <>
									<Divider style={{ margin: '8px 0' }}/>
									<CreateMedicalSubspecialty/>
								</>)
							}
						</>
					)}
					treeData={subspecialties.map(sb => ({ title: sb.name, value: sb.id }))}/>
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

export function CreateMedicalSpecialty() {
	return (
		<CreateDialog<IMedicalSpecialtyCreateArgs, IMedicalSpecialtyDependencies>
			title='Nueva especialidad médica'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_MEDICAL_SPECIALTY}
			render={(submit, close, data, refetch) => <MedicalSpecialtyForm mode='create' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function UpdateMedicalSpecialty({ id }: UpdateProps) {
	return (
		<UpdateDialog<IMedicalSpecialtyCreateArgs, IMedicalSpecialtyDependencies>
			id={id}
			title='Editar especialidad médica'
			query={query.UPDATE_DEPENDENCIES}
			mutation={mutation.UPDATE_MEDICAL_SPECIALTY}
			render={(submit, close, data, refetch) => <MedicalSpecialtyForm mode='update' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function DeleteMedicalSpecialty({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ medicalSpecialty: MedicalSpecialty }>
			id={id}
			title='Eliminar especialidad médica'
			render={({medicalSpecialty}) => `la especialidad médica: ${medicalSpecialty.name}`}
			query={query.MEDICAL_SPECIALTY}
			mutation={mutation.DELETE_MEDICAL_SPECIALTY}
		/>
	)
}

export function InspectMedicalSpecialty({ id }: UpdateProps) {
	return (
		<InspectDialog<{ medicalSpecialty: MedicalSpecialty }>
			id={id}
			title='Sub-especialidad médica'
			render={({medicalSpecialty}) => <>
				<Card>
					<b>Nombre: </b><div>{medicalSpecialty.name}</div>
				</Card>
			</>}
			query={query.MEDICAL_SPECIALTY}
		/>
	)
}
