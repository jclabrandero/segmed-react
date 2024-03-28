
import { useState } from 'react'
import { useSubscription } from '@apollo/client'
import { Button, Form, Input, Space, TreeSelect } from 'antd'

import { CreateDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { User, Group, UpdateProps } from '../../../types'

import { subscription as groupSubscription } from '../group/group.constant'
import { mutation, query } from './user.constant'


interface IUserCreateArgs {
	userName:			string
	displayName?:		string
	email?:				string

	groups?:			Array<number>

	password?:			string
	confirmPassword?:	string
}

interface IUserDependencies {
	groups:	Array<Group>
	user?:	User
}

type UserFormProps = {
	mode: 'create' | 'update'
	data: IUserDependencies
	onSubmit: (data: IUserCreateArgs) => void
	onCancel: () => void
	onRefetch: () => void
}


function UserForm({ mode, data, onSubmit, onCancel, onRefetch }: UserFormProps) {
	const { user } = data
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const [ confirmPassword, setConfirmPassword ] = useState(false)
	const onFinish = () => onSubmit(touched(form))
	const format = (payload?: User) => {
		if (!payload) return undefined
		const { groups, ...remaining } = payload
		return { ...remaining, groups: groups.map(group => group.id) }
	}

	useSubscription(groupSubscription.GROUP_UPSERTED, { onData: onRefetch })

	const groups = data ? data.groups : []

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={format(user)}>
			<Item
				name='userName'
				label='Nombre de usuario'
				rules={[{ required: true, message: 'Escriba el nombre de usuario' }]}>
				<Input disabled={mode == 'update'} placeholder='username'/>
			</Item>
			<Item
				name='displayName'
				label='Nombre para mostrar'>
				<Input placeholder='Nombre para mostrar'/>
			</Item>
			<Item
				name='email'
				label='Correo electrónico'>
				<Input type='mail' placeholder='company@mail.com'/>
			</Item>
			<Item
				name='groups'
				label='Grupos'>
				<TreeSelect treeCheckable={true} treeData={groups.map(rec => ({ title: rec.name, value: rec.id }))}/>
			</Item>

			<Item
				name='password'
				label='Contraseña'>
				<Input type='password' placeholder='Contraseña' onChange={(e) => setConfirmPassword(e.target.value.length > 0)}/>
			</Item>
			<Item
				name='confirmPassword'
				label='Confirme la contraseña'
				rules={[{ required: confirmPassword, message: 'Confirme la contraseña' }]}>
				<Input type='password' placeholder='Contraseña'/>
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

export function CreateUser() {
	return (
		<CreateDialog<IUserCreateArgs, IUserDependencies>
			title='Nuevo usuario'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_USER}
			render={(submit, close, data, refetch) => <UserForm mode='create' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function UpdateUser({ id }: UpdateProps) {
	return (
		<UpdateDialog<IUserCreateArgs, IUserDependencies>
			id={id}
			title='Editar usuario'
			query={query.UPDATE_DEPENDENCIES}
			mutation={mutation.UPDATE_USER}
			render={(submit, close, data, refetch) => <UserForm mode='update' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}
