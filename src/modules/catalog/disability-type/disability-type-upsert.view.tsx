
import { Button, Card, Form, Input, Space } from 'antd'

import { CreateDialog, DeleteDialog, InspectDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { DisabilityType, UpdateProps } from '../../../types'

import { mutation, query } from './disability-type.constant'


interface IDisabilityTypeCreateArgs {
	nombre:			string
	descripcion?:	string
}

interface IDisabilityTypeDependencies {
	disabilityType?: DisabilityType
}

type DisabilityTypeFormProps = {
	mode: 'create' | 'update'
	data: IDisabilityTypeDependencies
	onSubmit: (data: IDisabilityTypeCreateArgs) => void
	onCancel: () => void
}

function DisabilityTypeForm({ data, onSubmit, onCancel }: DisabilityTypeFormProps) {
	const { disabilityType } = data
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const onFinish = () => onSubmit(touched(form))

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={disabilityType}>
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
			<div className='modal-dialog-footer'>
				<Space>
					<Button type='default' onClick={onCancel}>Cancelar</Button>
					<Button type='primary' htmlType='submit'>Aceptar</Button>
				</Space>
			</div>
		</Form>
	)
}

export function CreateDisabilityType() {
	return (
		<CreateDialog<IDisabilityTypeCreateArgs, IDisabilityTypeDependencies>
			title='Nuevo tipo de discapacidad'
			mutation={mutation.CREATE_DISABILITY_TYPE}
			render={(submit, close) => <DisabilityTypeForm mode='create' data={{}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdateDisabilityType({ id }: UpdateProps) {
	return (
		<UpdateDialog<IDisabilityTypeCreateArgs, IDisabilityTypeDependencies>
			id={id}
			title='Editar tipo de discapacidad'
			query={query.DISABILITY_TYPE}
			mutation={mutation.UPDATE_DISABILITY_TYPE}
			render={(submit, close, data) => <DisabilityTypeForm mode='update' data={data} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function DeleteDisabilityType({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ disabilityType: DisabilityType }>
			id={id}
			title='Eliminar tipo de discapacidad'
			render={({ disabilityType }) => `tipo de discapacidad: ${disabilityType.name}`}
			query={query.DISABILITY_TYPE}
			mutation={mutation.DELETE_DISABILITY_TYPE}
		/>
	)
}

export function InspectDisabilityType({ id }: UpdateProps) {
	return (
		<InspectDialog<{ disabilityType: DisabilityType }>
			id={id}
			title='Tipo de discapacidad'
			render={({disabilityType}) => <>
				<Card>
					<b>Nombre: </b><div>{disabilityType.name}</div>
				</Card>
			</>}
			query={query.DISABILITY_TYPE}
		/>
	)
}
