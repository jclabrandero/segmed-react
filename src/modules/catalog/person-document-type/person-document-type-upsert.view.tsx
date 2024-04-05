
import { Button, Form, Input, Space } from 'antd'

import { CreateDialog, DeleteDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { PersonDocumentType, UpdateProps } from '../../../types'

import { mutation, query } from './person-document-type.constant'


interface IPersonDocumentTypeCreateArgs {
	nombre:			string
	descripcion?:	string
}

interface IPersonDocumentTypeDependencies {
	personDocumentType?: PersonDocumentType
}

type PersonDocumentTypeFormProps = {
	mode: 'create' | 'update'
	data: IPersonDocumentTypeDependencies
	onSubmit: (data: IPersonDocumentTypeCreateArgs) => void
	onCancel: () => void
}

function PersonDocumentTypeForm({ data, onSubmit, onCancel }: PersonDocumentTypeFormProps) {
	const { personDocumentType } = data
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const onFinish = () => onSubmit(touched(form))
	const format = (payload?: PersonDocumentType) => {
		if (!payload) return undefined
		const { ...remaining } = payload
		return { ...remaining }
	}

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={format(personDocumentType)}>
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

export function CreatePersonDocumentType() {
	return (
		<CreateDialog<IPersonDocumentTypeCreateArgs, IPersonDocumentTypeDependencies>
			title='Nuevo tipo de documento identidad'
			mutation={mutation.CREATE_PERSON_DOCUMENT_TYPE}
			render={(submit, close) => <PersonDocumentTypeForm mode='create' data={{}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdatePersonDocumentType({ id }: UpdateProps) {
	return (
		<UpdateDialog<IPersonDocumentTypeCreateArgs, IPersonDocumentTypeDependencies>
			id={id}
			title='Editar tipo de documento identidad'
			query={query.PERSON_DOCUMENT_TYPE}
			mutation={mutation.UPDATE_PERSON_DOCUMENT_TYPE}
			render={(submit, close, data) => <PersonDocumentTypeForm mode='update' data={data} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function DeletePersonDocumentType({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ personDocumentType: PersonDocumentType }>
			id={id}
			title='Eliminar tipo de documento identidad'
			render={({ personDocumentType }) => `el tipo de documento identidad: ${personDocumentType.name}`}
			query={query.PERSON_DOCUMENT_TYPE}
			mutation={mutation.DELETE_PERSON_DOCUMENT_TYPE}
		/>
	)
}
