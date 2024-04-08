
import { useSubscription } from '@apollo/client'
import { Button, DatePicker, Divider, Form, Input, Select, Space } from 'antd'
import dayjs from 'dayjs'

import { CreateDialog, DeleteDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { Person, PersonDocumentType, UpdateProps } from '../../../types'

import { CreatePersonDocumentType } from '../../catalog/person-document-type/person-document-type-upsert.view'
import { subscription as PersonDocumentTypeSubscription } from '../../catalog/person-document-type/person-document-type.constant'
import { mutation, query } from './person.constant'


interface IPersonCreateArgs {
	firstName:	string
	lastName:	string
	sex:		string
	birthDate:	Date

	documentNumber?:		string
	personDocumentTypeId?:	number
}

interface IPersonDependencies {
	personDocumentTypes: Array<PersonDocumentType>
	person?: Person
}

type PersonFormProps = {
	mode: 'create' | 'update'
	data: IPersonDependencies
	onSubmit: (data: IPersonCreateArgs) => void
	onCancel: () => void
	onRefetch: () => void
}

function PersonForm({ data, onSubmit, onCancel, onRefetch }: PersonFormProps) {
	const { person } = data
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const onFinish = () => {
		const { birthDate, ...remaining } = touched(form)
		onSubmit(birthDate ? { ...remaining, birthDate: birthDate.$d } : { ...remaining })
	}
	const format = (payload?: Person) => {
		if (!payload) return undefined
		const { personDocumentType, birthDate, ...remaining } = payload
		return { ...remaining, birthDate: dayjs(birthDate), personDocumentTypeId: personDocumentType?.id }
	}
	const personDocumentTypes = data ? data.personDocumentTypes : []

	useSubscription(PersonDocumentTypeSubscription.PERSON_DOCUMENT_TYPE_UPSERTED, { onData: onRefetch })

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={format(person)}>
			<Item
				name='firstName'
				label='Nombres'
				rules={[{ required: true, message: 'Escriba el o los nombres de la persona' }]}>
				<Input placeholder='Nombre de la persona'/>
			</Item>
			<Item
				name='lastName'
				label='Apellidos'
				rules={[{ required: true, message: 'Escriba apellidos de la persona' }]}>
				<Input placeholder='Apellidos'/>
			</Item>
			<Item
				name='sex'
				label='Sexo'
				rules={[{ required: true, message: 'Seleccione el sexo' }]}>
				<Select options={[{ value: 'Femenino' }, { value: 'Masculino' }]}/>
			</Item>
			<Item
				name='birthDate'
				label='Fecha de nacimiento'
				rules={[{ required: true, message: 'Seleccione fecha de nacimiento' }]}>
				<DatePicker format='DD/MM/YYYY'/>
			</Item>
			<Item
				name='personDocumentTypeId'
				label='Tipo documento de identidad'>
				<Select
					placeholder='Tipo documento de identidad'
					options={personDocumentTypes.map(rec => ({ label: rec.name, value: rec.id }))}
					dropdownRender={(menu) => (
						<>
							{menu}
							<Divider style={{ margin: '8px 0' }}/>
							<div style={{ margin: '6px' }}><CreatePersonDocumentType/></div>
						</>
					)}/>
			</Item>
			<Item
				name='documentNumber'
				label='Número de documento de identidad'>
				<Input placeholder='Número de documento de identidad'/>
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

export function CreatePerson() {
	return (
		<CreateDialog<IPersonCreateArgs, IPersonDependencies>
			title='Nuevo registro de persona'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_PERSON}
			render={(submit, close, data, refetch) => <PersonForm mode='create' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function UpdatePerson({ id }: UpdateProps) {
	return (
		<UpdateDialog<IPersonCreateArgs, IPersonDependencies>
			id={id}
			title='Editar datos de persona'
			query={query.UPDATE_DEPENDENCIES}
			mutation={mutation.UPDATE_PERSON}
			render={(submit, close, data, refetch) => <PersonForm mode='update' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function DeletePerson({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ person: Person }>
			id={id}
			title='Eliminar datos de persona'
			render={({ person }) => `datos de persona: ${person.firstName} ${person.lastName}`}
			query={query.PERSON}
			mutation={mutation.DELETE_PERSON}
		/>
	)
}
