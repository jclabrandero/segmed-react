

import { Button, Card, Checkbox, Form, Input, InputNumber, Space } from 'antd'

import { CreateDialog, DeleteDialog, InspectDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { InsuredType, UpdateProps } from '../../../types'

import { mutation, query } from './insured-type.constant'


interface IInsuredTypeCreateArgs {
	name:			string
	description?:	string
	withDependents:	boolean
}

interface IInsuredTypeDependencies {
	insuredType?: InsuredType
}

type InsuredTypeFormProps = {
	mode: 'create' | 'update'
	data: IInsuredTypeDependencies
	onSubmit: (data: IInsuredTypeCreateArgs) => void
	onCancel: () => void
}

function InsuredTypeForm({ mode, data, onSubmit, onCancel }: InsuredTypeFormProps) {
	const { insuredType } = data
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const onFinish = () => {
		const payload = touched(form)
		if (mode == 'create') payload.withDependents = payload.withDependents || false
		onSubmit(payload)
	}

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={insuredType}>
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
				name='codeFormat'
				label='Formato de código'>
				<Input/>
			</Item>
			<Item
				name='outletAge'
				label='Edad de baja'>
				<InputNumber min='1'/>
			</Item>
			<Item name='withDependents' valuePropName='checked'>
				<Checkbox defaultChecked={false}>Con dependientes</Checkbox>
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

export function CreateInsuredType() {
	return (
		<CreateDialog<IInsuredTypeCreateArgs, IInsuredTypeDependencies>
			title='Nuevo tipo de beneficiario'
			mutation={mutation.CREATE_INSURED_TYPE}
			render={(submit, close) => <InsuredTypeForm mode='create' data={{}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdateInsuredType({ id }: UpdateProps) {
	return (
		<UpdateDialog<IInsuredTypeCreateArgs, IInsuredTypeDependencies>
			id={id}
			title='Editar tipo de beneficiario'
			query={query.INSURED_TYPE}
			mutation={mutation.UPDATE_INSURED_TYPE}
			render={(submit, close, data) => <InsuredTypeForm mode='update' data={data} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function DeleteInsuredType({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ insuredType: InsuredType }>
			id={id}
			title='Eliminar tipo de beneficiario'
			render={({insuredType}) => `el tipo de beneficiario: ${insuredType.name}`}
			query={query.INSURED_TYPE}
			mutation={mutation.DELETE_INSURED_TYPE}
		/>
	)
}

export function InspectInsuredType({ id }: UpdateProps) {
	return (
		<InspectDialog<{ insuredType: InsuredType }>
			id={id}
			title='Tipo de beneficiario'
			render={({insuredType}) => <>
				<Card>
					<b>Nombre: </b><div>{insuredType.name}</div>
				</Card>
			</>}
			query={query.INSURED_TYPE}
		/>
	)
}
