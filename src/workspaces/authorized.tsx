
import { useRef } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { Avatar, Dropdown, Menu } from 'antd'
import { ApartmentOutlined, CarryOutOutlined, DatabaseOutlined, MedicineBoxOutlined, MenuOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'

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
	MedicalSubspecialtyList, MedicalSpecialtyList, MedicalGroupList,
	DrugClassList, DrugUnitList,
	ClinicalCareStateList, DisabilityTypeList
} from '../modules/catalog'
import { BelongingList, MedicalOfficeList, ProviderList } from '../modules/reference'
import { PersonList, ClerkList, InsuredList } from '../modules/folk'
import { MedicationList, PharmacyList } from '../modules/drugstore'
import { ClinicCareList, ClinicCareManage } from '../modules/health'


function useAuthorized() {
	const [ error, onError ] = useError()
		, navigate = useNavigate()
		, { user, auth, has } = useAuth()
		, mainRef = useRef<HTMLDivElement>(null)
	
	const onCompleted = () => {
		setAuth({ sessionId: 0, token: '' })
		userState(getDefaultUser())
		navigate('/')
	}
	const [ serverSignOut, { loading } ] = useMutation(mutation.SIGNOUT, { onCompleted, onError })

	const signOut = () => serverSignOut({ variables: { sessionId: auth.sessionId } })
		, toggleSide = () => {
			if (mainRef.current) mainRef.current.className = mainRef.current.className === 'workspace-flat' ? 'workspace-split' : 'workspace-flat'
		}

	const menu = {
		configuration: [
			has('ReadUser', { label: 'Usuarios', key: '/configuracion/usuarios' }),
			has('ReadGroup', { label: 'Grupos', key: '/configuracion/grupos' }),
			has('ReadPermission', { label: 'Permisos', key: '/configuracion/permisos' })
		].filter(e => e != null),
		catalog: [
			has('ReadPersonDocumentType', { label: 'Tipos de documento identidad', key: '/catalogo/tipos-documento-identidad' }),
			has('ReadEmployeePosition', { label: 'Cargos funcionarios', key: '/catalogo/cargos-funcionarios' }),
			has('ReadEmployeeType', { label: 'Tipos de funcionarios', key: '/catalogo/tipos-funcionarios' }),
			has('ReadInsuredType', { label: 'Tipos de beneficiarios', key: '/catalogo/tipos-beneficiarios' }),
			has('ReadMedicalGroup', { label: 'Unidades médicas', key: '/catalogo/unidades-medicas' }),
			has('ReadMedicalSpecialty', { label: 'Especialidades médicas', key: '/catalogo/especialidades-medicas' }),
			has('ReadMedicalSubspecialty', { label: 'Sub-especialidades médicas', key: '/catalogo/sub-especialidades-medicas' }),
			has('ReadDrugClass', { label: 'Clases de medicamentos', key: '/catalogo/clases-medicamentos' }),
			has('ReadDrugUnit', { label: 'Unidades de medicamentos', key: '/catalogo/unidades-medicamentos' }),
			has('ReadClinicalCareState', { label: 'Estados de consultas', key: '/catalogo/estados-consultas' }),
			has('ReadDisabilityType', { label: 'Tipos de discapacidades', key: '/catalogo/tipos-discapacidades' })
		].filter(e => e != null),
		folk: [
			has('ReadPerson', { label: 'Personas', key: '/identidad/personas' }),
			has('ReadClerk', { label: 'Funcionarios', key: '/identidad/funcionarios' }),
			has('ReadInsured', { label: 'Beneficiarios', key: '/identidad/beneficiarios' })
		].filter(e => e != null),
		reference: [
			has('ReadBelonging', { label: 'Pertinencias', key: '/referencia/pertinencias' }),
			has('ReadMedicalOffice', { label: 'Consultorios', key: '/referencia/consultorios' }),
			has('ReadProvider', { label: 'Proveedores', key: '/referencia/proveedores' })
		].filter(e => e != null),
		drugstore: [
			has('ReadMedication', { label: 'Medicamentos', key: '/almacenes/medicamentos' }),
			has('ReadPharmacy', { label: 'Farmacias', key: '/almacenes/farmacias' })
		].filter(e => e != null),
		health: [
			has('ReadClinicCare', { label: 'Consulta médica', key: '/consulta' })
		].filter(e => e != null)
	}

	return { loading, error, user, navigate, signOut, toggleSide, mainRef, menu }
}

export function Authorized() {
	const { loading, error, user, navigate, signOut, toggleSide, mainRef, menu } = useAuthorized()

	return (
		<div className='workspace'>
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
							menu.health.length ? {
								label: 'Servicios',
								key: 'servicios',
								icon: <MedicineBoxOutlined/>,
								children: menu.health
							} : null,
							menu.folk.length ? {
								label: 'Identidad',
								key: 'identidad',
								icon: <UserOutlined/>,
								children: menu.folk
							} : null,
							menu.reference.length ? {
								label: 'Referencia',
								key: 'referencia',
								icon: <ApartmentOutlined/>,
								children: menu.reference
							} : null,
							menu.drugstore.length ? {
								label: 'Almacenes',
								key: 'almacenes',
								icon: <DatabaseOutlined/>,
								children: menu.drugstore
							} : null,
							menu.catalog.length ? {
								label: 'Catálogo',
								key: 'catalogo',
								icon: <CarryOutOutlined/>,
								children: menu.catalog
							} : null,
							menu.configuration.length ? {
								label: 'Configuración',
								key: 'configuracion',
								icon: <SettingOutlined/>,
								children: menu.configuration
							} : null
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
							<Route path="tipos-documento-identidad" element={<PersonDocumentTypeList/>}/>
							<Route path="cargos-funcionarios" element={<EmployeePositionList/>}/>
							<Route path='tipos-funcionarios' element={<EmployeeTypeList/>}/>
							<Route path='tipos-beneficiarios' element={<InsuredTypeList/>}/>
							<Route path="unidades-medicas" element={<MedicalGroupList/>}/>
							<Route path='especialidades-medicas' element={<MedicalSpecialtyList/>}/>
							<Route path='sub-especialidades-medicas' element={<MedicalSubspecialtyList/>}/>
							<Route path='clases-medicamentos' element={<DrugClassList/>}/>
							<Route path='unidades-medicamentos' element={<DrugUnitList/>}/>
							<Route path="estados-consultas" element={<ClinicalCareStateList/>}/>
							<Route path="tipos-discapacidades" element={<DisabilityTypeList/>}/>
						</Route>
						<Route path="referencia">
							<Route path="pertinencias" element={<BelongingList/>}/>
							<Route path="consultorios" element={<MedicalOfficeList/>}/>
							<Route path="proveedores" element={<ProviderList/>}/>
						</Route>
						<Route path="almacenes">
							<Route path="medicamentos" element={<MedicationList/>}/>
							<Route path="farmacias" element={<PharmacyList/>}/>
						</Route>
						<Route path="configuracion">
							<Route path="usuarios" element={<UserList/>}/>
							<Route path="grupos" element={<GroupList/>}/>
							<Route path="permisos" element={<PermissionList/>}/>
						</Route>
						<Route path='consulta'>
							<Route path='' element={<ClinicCareList/>}/>
							<Route path='atencion/:id' element={<ClinicCareManage/>}/>
						</Route>

						<Route path="*" element={<NotFound/>}/>
					</Routes>
				</main>
			</div>

			<Loader show={loading}/>
			<ErrorDialog error={error}/> 
		</div>
	)
}
