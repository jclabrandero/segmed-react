
import { Button, Form, Input, Space, TreeSelect } from 'antd'

import { CreateDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { Group, Permission, UpdateProps } from '../../../types'

import { mutation, query } from './group.constant'


interface IGroupCreateArgs {
	nombre:			string
	descripcion?:	string

	permissions?:	Array<number>
}

interface IGroupDependencies {
	permissions:	Array<Permission>
	group?:			Group
}

type GroupFormProps = {
	mode: 'create' | 'update'
	data: IGroupDependencies
	onSubmit: (data: IGroupCreateArgs) => void
	onCancel: () => void
}

function GroupForm({ data, onSubmit, onCancel }: GroupFormProps) {
	const { group } = data
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const onFinish = () => onSubmit(touched(form))
	const format = (payload?: Group) => {
		if (!payload) return undefined
		const { permissions, ...remaining } = payload
		return { ...remaining, permissions: permissions.map(permission => permission.id) }
	}

	const permissions = data ? data.permissions : []

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={format(group)}>
			<Item
				name='name'
				label='Nombre'
				rules={[{ required: true, message: 'Escriba el nombre del grupo' }]}>
				<Input placeholder='Nombre'/>
			</Item>
			<Item
				name='description'
				label='Descripción'>
				<Input placeholder='Descripción'/>
			</Item>
			<Item
				name='permissions'
				label='Permisos'>
				<TreeSelect treeCheckable={true} treeData={permissions.map(rec => ({ title: `${rec.code} (${rec.description})`, value: rec.id }))}/>
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

export function CreateGroup() {
	return (
		<CreateDialog<IGroupCreateArgs, IGroupDependencies>
			title='Nuevo grupo'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_GROUP}
			render={(submit, close, data) => <GroupForm mode='create' data={data} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdateGroup({ id }: UpdateProps) {
	return (
		<UpdateDialog<IGroupCreateArgs, IGroupDependencies>
			id={id}
			title='Editar usuario'
			query={query.UPDATE_DEPENDENCIES}
			mutation={mutation.UPDATE_GROUP}
			render={(submit, close, data) => <GroupForm mode='update' data={data} onSubmit={submit} onCancel={close}/>}
		/>
	)
}
