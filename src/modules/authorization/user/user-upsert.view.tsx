
import { useState } from 'react'
import { Button, Form, Input, Space } from 'antd'

import { CreateDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { User, UpdateProps } from '../../../types'

import { mutation, query } from './user.constant'


interface IUserCreateArgs {
	userName:			string
	displayName?:		string
	email?:				string

	password?:			string
	confirmPassword?:	string
}

interface IUserDependencies {
	user?: User
}

type UserFormProps = {
	mode: 'create' | 'update'
	data: IUserDependencies
	onSubmit: (data: IUserCreateArgs) => void
	onCancel: () => void
}


function UserForm({ mode, data, onSubmit, onCancel }: UserFormProps) {
	const { user } = data
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const [ confirmPassword, setConfirmPassword ] = useState(false)
	const onFinish = () => onSubmit(touched(form))

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form}
			initialValues={user ? {
				userName: user.userName,
				displayName: user.displayName,
				email: user.email
			} : undefined}
		>
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
			mutation={mutation.CREATE_USER}
			render={(submit, close) => <UserForm mode='create' data={{}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdateUser({ id }: UpdateProps) {
	return (
		<UpdateDialog<IUserCreateArgs, IUserDependencies>
			id={id}
			title='Editar usuario'
			query={query.USER}
			mutation={mutation.UPDATE_USER}
			render={(submit, close, data) => <UserForm mode='update' data={data} onSubmit={submit} onCancel={close}/>}
		/>
	)
}
