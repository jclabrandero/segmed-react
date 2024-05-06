
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button } from 'antd'

import { ErrorDialog, Loader } from '../../../components'
import { useError } from '../../../hooks'
import { setAuth } from '../../../utils'

import { rules, mutation } from './signin.constant'
import { ISignInData, ISignInResponse } from './signin.type'

import './signin.style.css'


export function SignIn() {
	const [ error, onError ] = useError()
		, navigate = useNavigate()
	const onCompleted = ({ signIn }: { signIn: ISignInResponse }) => {
		setAuth(signIn)
		navigate('/')
	}
	const [ signIn, { loading } ] = useMutation(mutation.SIGNIN, { onCompleted, onError })
	const onSubmit = (data: ISignInData) => signIn({ variables: { data }})
	const { Item } = Form

	return (
		<div className='signin'>
			<Form name='signin' layout='vertical' autoComplete='off' onFinish={onSubmit}>
				<div className='signin-input'>
					<Item name='userName' label='Nombre de usuario' rules={rules.userName}>
						<Input/>
					</Item>
					<Item name='password' label='Contraseña' rules={rules.password}>
						<Input type='password'/>
					</Item>
				</div>
				<div className='signin-button'>
					<Button type='primary' htmlType='submit'>Iniciar sesión</Button>
				</div>
			</Form>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</div>
	)
}
