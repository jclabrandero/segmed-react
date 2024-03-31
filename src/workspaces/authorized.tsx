
import { useRef } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useMutation, useReactiveVar } from '@apollo/client'
import { Avatar, Dropdown, Menu } from 'antd'
import { MenuOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'

import { ErrorDialog, Loader, NavAction, NavBar, NavBrand, NavMenu } from '../components'
import { useError } from '../hooks'
import { authState, userState, getDefaultUser, setAuth } from '../utils'

import { mutation } from '../modules/authorization/signin/signin.constant'
import { Home, NotFound } from '../modules/basic'
import { UserList, GroupList, PermissionList } from '../modules/authorization'


function useAuthorized() {
	const [ error, onError ] = useError()

	const user = useReactiveVar(userState)
		, auth = useReactiveVar(authState)
		, mainRef = useRef<HTMLDivElement>(null)
	
	const onCompleted = () => {
		setAuth({ sessionId: 0, token: '' })
		userState(getDefaultUser())
	}
	const [ serverSignOut, { loading } ] = useMutation(mutation.SIGNOUT, { onCompleted, onError })

	const signOut = () => serverSignOut({ variables: { sessionId: auth.sessionId } })
		, toggleSide = () => {
			if (mainRef.current) mainRef.current.className = mainRef.current.className === 'workspace-flat' ? 'workspace-split' : 'workspace-flat'
		}

	return { loading, error, user, signOut, toggleSide, mainRef }
}

export function Authorized() {
	const { loading, error, user, signOut, toggleSide, mainRef } = useAuthorized()
	const navigate = useNavigate()

	return (
		<>
			<header>
				<NavBar>
					<NavMenu>
						<NavAction action={toggleSide}>
							<MenuOutlined/>
						</NavAction>
						<NavBrand>
							<h4 className='segmed-brand'>Seguro Médico - SEGMED</h4>
						</NavBrand>
					</NavMenu>
					<NavMenu>
						<Dropdown menu={{
							items: [
								{
									label: <>
										<div className='nav-user-header'>
											<div className="nav-user-email">
												<span>{ user.email || '(Sin correo eléctronico)' }</span>
											</div>
											<div className='nav-user-pic'>
												<Avatar size={64}>{ user.userName.toUpperCase()[0] }</Avatar>
											</div>
											<div className="nav-user-name">
												<span>{ user.displayName || '(Sin Nombre)' }</span>
											</div>
										</div>
									</>,
									key: '0'
								},
								{ label: 'Configurar cuenta', key: '1' },
								{ label: 'Cerrar sesión', key: '2', onClick: () => signOut() }
							]
						}} trigger={['click']}>
							<Avatar icon={<UserOutlined/>}></Avatar>
						</Dropdown>
					</NavMenu>
				</NavBar>
			</header>
			<div ref={mainRef} className='workspace-split'>
				<aside>
					<Menu
						mode='inline'
						onClick={(e) => navigate(e.key)}
						defaultOpenKeys={['identidad', 'servicios']}
						items={[
							{
								label: 'Configuración',
								key: 'configuracion',
								icon: <SettingOutlined/>,
								children: [
									{ label: 'Usuarios', key: '/configuracion/usuarios' },
									{ label: 'Grupos', key: '/configuracion/grupos' },
									{ label: 'Permisos', key: '/configuracion/permisos' }
								]
							}
						]}
					/>
				</aside>
				<main>
					<Routes>
						<Route path="/" element={<Home/>}/>

						<Route path="configuracion">
							<Route path="usuarios" element={<UserList/>}/>
							<Route path="grupos" element={<GroupList/>}/>
							<Route path="permisos" element={<PermissionList/>}/>
						</Route>

						<Route path="*" element={<NotFound/>}/>
					</Routes>
				</main>
			</div>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
