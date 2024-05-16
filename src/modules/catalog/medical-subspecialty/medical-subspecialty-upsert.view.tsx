
import { Button, Card, Form, Input, Select, Space } from 'antd'

import { CreateDialog, DeleteDialog, InspectDialog, UpdateDialog } from '../../../components'
import { MedicalSubspecialty, UpdateProps } from '../../../types'

import { mutation, query } from './medical-subspecialty.constant'


interface IMedicalSubspecialtyCreateArgs {
	name:				string
	description?:		string
	ageRangePatients?:	string

	dt?:	string
	si?:	string
	ot?:	string
}

interface IMedicalSubspecialtyDependencies {
	medicalSubspecialty?: MedicalSubspecialty
}

type MedicalSubspecialtyFormProps = {
	mode: 'create' | 'update'
	data: IMedicalSubspecialtyDependencies
	onSubmit: (data: IMedicalSubspecialtyCreateArgs) => void
	onCancel: () => void
}

function MedicalSubspecialtyForm({ data, onSubmit, onCancel }: MedicalSubspecialtyFormProps) {
	const { medicalSubspecialty } = data
	const { Item } = Form
	const [ form ] = Form.useForm()
	const onFinish = () => onSubmit(form.getFieldsValue({ filter: (meta) => meta.touched }))
	const format = (payload?: MedicalSubspecialty) => {
		if (!payload) return undefined
		const { ...remaining } = payload
		return { ...remaining }
	}

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={format(medicalSubspecialty)}>
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
			<Item
				name='ageRangePatients'
				label='Rango de edad de los pacientes'>
				<Select options={[{ value: 'Adultos' }, { value: 'Geriátrico' }, { value: 'Neonatal' }, { value: 'Pediátrico' }, { value: 'Todos' }]}/>
			</Item>
			<Item
				name='dt'
				label='Diagnóstico o Terapéutico'>
				<Select options={[{ value: 'Ambos' }, { value: 'Diagnóstico' }, { value: 'Terapéutico' }, { value: 'Ninguno' }]}/>
			</Item>
			<Item
				name='si'
				label='Quirúrgico o Medicina interna'>
				<Select options={[{ value: 'Ambos' }, { value: 'Quirúrgico' }, { value: 'Medicina interna' }, { value: 'Ninguno' }]}/>
			</Item>
			<Item
				name='ot'
				label='Basado en órganos o Basado en la técnica'>
				<Select options={[{ value: 'Ambos' }, { value: 'Basado en órganos' }, { value: 'Basado en la técnica' }, { value: 'Multidiciplinario' }, { value: 'Ninguno' }]}/>
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

export function CreateMedicalSubspecialty() {
	return (
		<CreateDialog<IMedicalSubspecialtyCreateArgs, IMedicalSubspecialtyDependencies>
			title='Nueva sub-especialidad médica'
			mutation={mutation.CREATE_MEDICAL_SUBSPECIALTY}
			render={(submit, close) => <MedicalSubspecialtyForm mode='create' data={{}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdateMedicalSubspecialty({ id }: UpdateProps) {
	return (
		<UpdateDialog<IMedicalSubspecialtyCreateArgs, IMedicalSubspecialtyDependencies>
			id={id}
			title='Editar sub-especialidad médica'
			query={query.MEDICAL_SUBSPECIALTY}
			mutation={mutation.UPDATE_MEDICAL_SUBSPECIALTY}
			render={(submit, close, data) => <MedicalSubspecialtyForm mode='update' data={data} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function DeleteMedicalSubspecialty({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ medicalSubspecialty: MedicalSubspecialty }>
			id={id}
			title='Eliminar sub-especialidad médica'
			render={({medicalSubspecialty}) => `la sub-especialidad médica: ${medicalSubspecialty.name}`}
			query={query.MEDICAL_SUBSPECIALTY}
			mutation={mutation.DELETE_MEDICAL_SUBSPECIALTY}
		/>
	)
}

export function InspectMedicalSubspecialty({ id }: UpdateProps) {
	return (
		<InspectDialog<{ medicalSubspecialty: MedicalSubspecialty }>
			id={id}
			title='Sub-especialidad médica'
			render={({medicalSubspecialty}) => <>
				<Card>
					<b>Nombre: </b><div>{medicalSubspecialty.name}</div>
				</Card>
			</>}
			query={query.MEDICAL_SUBSPECIALTY}
		/>
	)
}
