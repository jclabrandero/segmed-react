
import { useQuery, useSubscription } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { Card, Flex, Space, Tabs } from 'antd'

import { ErrorDialog, Loader } from '../../../components'
import { useError, useDate } from '../../../hooks'

import { ClinicCarePrimaryManage } from '../clinic-care-primary/clinic-care-primary-manage.view'
import { InterclinicalManage } from '../inter-clinical/inter-clinical-manage.view'
import { PrescriptionManage } from '../prescription/prescription-manage.view'

import { ClinicCareState } from './clinic-care-state.view'
import { query, subscription } from './clinic-care.constant'
import { Interclinical } from '../../../types'


export function ClinicCareManage() {
	const id = Number(useParams().id)
		, [ error, onError ] = useError()
		, { format } = useDate()
	const { loading, data, refetch} = useQuery(query.CLINIC_CARE, { variables: { id }, onError  })

	useSubscription(subscription.CLINIC_CARE_UPSERTED, { onData: () => refetch() })

	if (loading) return (<Loader show={ true }/>)
	if (error.has) return (<ErrorDialog error={ error } />)
	if (!data) return null

	const { startDate, insured, medicalOffice, primary, state, interclinicals, prescriptions, prescriptionExterns } = data.clinicCare
	const edit = !state.lock
	const filterStates: boolean = Boolean(interclinicals.filter(({ approvedState }: Interclinical) => approvedState !== 2).length)

	return (
		<Space direction='vertical' style={{ display: 'flex' }}>
			<Card size='small' title='Datos de la consulta'>
				<Flex justify="space-between">
					<div>
						<small><b>ID Consulta</b></small>
						<div><span>{id}</span></div>
					</div>
					<div>
						<small><b>Consultorio</b></small>
						<div><span>{medicalOffice.name}</span></div>
					</div>
					<div>
						<small><b>Fecha de la consulta</b></small>
						<div><span>{format(startDate)}</span></div>
					</div>
					<div>
						<small><b>Estado de la consulta</b></small>
						<div><ClinicCareState clinicCareId={id} state={state} edit={edit} filterStates={filterStates}/></div>
					</div>
				</Flex>
			</Card>
			<Card size='small' title='Datos del beneficiario'>
				<Flex justify="space-between">
					<div>
						<small>ID beneficiario</small>
						<div><span>{insured.id}</span></div>
					</div>
					<div>
						<small>Codigo beneficiario</small>
						<div><span>{insured.code}</span></div>
					</div>
					<div>
						<small>Ficha</small>
						<div><span>{insured.iin}</span></div>
					</div>
					<div>
						<small>Nombre del beneficiario</small>
						<div><span>{insured.person.firstName} {insured.person.lastName}</span></div>
					</div>
				</Flex>
			</Card>
			<Card size='small'>
				<Tabs items={[
					{
						key: 'a123',
						label: 'Información',
						children: <ClinicCarePrimaryManage clinicCareId={id} primary={primary} edit={edit}/>
					},
					{
						key: 'a124',
						label: 'Medicamentos',
						children: <PrescriptionManage clinicCareId={id} prescriptions={prescriptions} prescriptionExterns={prescriptionExterns} edit={edit}/>
					},
					{
						key: 'a125',
						label: 'Interconsulta',
						children: <InterclinicalManage clinicCareId={id} interclinicals={interclinicals} edit={edit}/>
					}
				]}/>
			</Card>
		</Space>
	)
}
