
import { useRef } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { Avatar, Dropdown, Menu } from 'antd'
import { ApartmentOutlined, CarryOutOutlined, MenuOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'

import { ErrorDialog, Loader, NavAction, NavBar, NavBrand, NavMenu } from '../components'
import { useAuth, useError } from '../hooks'
import { userState, getDefaultUser, setAuth } from '../utils'

import { mutation } from '../modules/authorization/signin/signin.constant'
import { Home, NotFound } from '../modules/basic'
import { UserList, GroupList, PermissionList } from '../modules/authorization'
import { 
	PersonDocumentTypeList,
	EmployeePositionList, EmployeeTypeList,
	InsuredTypeList,
	MedicalSubspecialtyList, MedicalSpecialtyList
} from '../modules/catalog'
import { BelongingList, MedicalOfficeList } from '../modules/reference'
import { PersonList, ClerkList, InsuredList } from '../modules/folk'


function useAuthorized() {
	const [ error, onError ] = useError()

	const { user, auth } = useAuth()
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
								label: 'Identidad',
								key: 'identidad',
								icon: <UserOutlined/>,
								children: [
									{ label: 'Personas', key: '/identidad/personas' },
									{ label: 'Funcionarios', key: '/identidad/funcionarios' },
									{ label: 'Beneficiarios', key: '/identidad/beneficiarios' }
								]
							},
							{
								label: 'Catálogo',
								key: 'catalogo',
								icon: <CarryOutOutlined/>,
								children: [
									{ label: 'Cargos funcionarios', key: '/catalogo/cargos-funcionarios' },
									{ label: 'Tipos de funcionarios', key: '/catalogo/tipos-funcionarios' },
									{ label: 'Tipos de documento identidad', key: '/catalogo/tipos-documento-identidad' },
									{ label: 'Tipos de beneficiarios', key: '/catalogo/tipos-beneficiarios' },
									{ label: 'Especialidades médicas', key: '/catalogo/especialidades-medicas' },
									{ label: 'Sub-especialidades médicas', key: '/catalogo/sub-especialidades-medicas' }
								]
							},
							{
								label: 'Referencia',
								key: 'referencia',
								icon: <ApartmentOutlined/>,
								children: [
									{ label: 'Pertinencias', key: '/referencia/pertinencias' },
									{ label: 'Consultorios', key: '/referencia/consultorios' }
								]
							},
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

						<Route path="identidad">
							<Route path="personas" element={<PersonList/>}/>
							<Route path="funcionarios" element={<ClerkList/>}/>
							<Route path="beneficiarios" element={<InsuredList/>}/>
						</Route>
						<Route path="catalogo">
							<Route path="cargos-funcionarios" element={<EmployeePositionList/>}/>
							<Route path='tipos-funcionarios' element={<EmployeeTypeList/>}/>
							<Route path="tipos-documento-identidad" element={<PersonDocumentTypeList/>}/>
							<Route path='tipos-beneficiarios' element={<InsuredTypeList/>}/>
							<Route path='especialidades-medicas' element={<MedicalSpecialtyList/>}/>
							<Route path='sub-especialidades-medicas' element={<MedicalSubspecialtyList/>}/>
						</Route>
						<Route path="referencia">
							<Route path="pertinencias" element={<BelongingList/>}/>
							<Route path="consultorios" element={<MedicalOfficeList/>}/>
						</Route>
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
