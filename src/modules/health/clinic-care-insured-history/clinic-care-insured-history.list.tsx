
import { useQuery, useSubscription } from '@apollo/client'
import { Button, Card, Flex, Input, Table, Tag } from 'antd'
import { MedicineBoxFilled } from '@ant-design/icons'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useDate, useAntdHelp, useAuth } from '../../../hooks'

import { query, subscription } from './clinic-care-insured-history.constant'
import { Link, useParams } from 'react-router-dom'

import './clinic-care-insured-history.style.css'

export function ClinicCareInsuredHistoryList() {
	const id = Number(useParams().id)
	const { addKey } = useAntdHelp()
		, { has } = useAuth()
		, { format } = useDate()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.CLINIC_CARES_INSURED_HISTORY, { variables: { filter: { insuredId: id }, id }, onError })
	const { Column } = Table

	useSubscription(subscription.CLINIC_CARE_UPSERTED, { onData: () => refetch() })

	return has('ReadClinicCare',
		<>
			<Card size='small' title='Datos del beneficiario' className='clinic-care-injured-card'>
				<Flex justify="space-between">
					<div>
						<small>ID beneficiario</small>
						<div><span>{data?.insured.id}</span></div>
					</div>
					<div>
						<small>Código beneficiario</small>
						<div><span>{data?.insured.code}</span></div>
					</div>
					<div>
						<small>Ficha</small>
						<div><span>{data?.insured.iin}</span></div>
					</div>
					<div>
						<small>Nombre del beneficiario</small>
						<div><span>{data?.insured.person.firstName} {data?.insured.person.lastName}</span></div>
					</div>
				</Flex>
			</Card>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear/>
				</ToolBarMenu>

			</ToolBar>

			<Table
				size='middle'
				dataSource={addKey(data?.filterClinicCares)}
				bordered={true}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Número' dataIndex='id'/>
				<Column title='Diagnóstico' render={({ primary }) => (
					<span>{ primary?.diagnosis }</span>
				)}/>
				<Column title='Fecha de inicio' ellipsis render={({ startDate }) => (
					<span>{ format(startDate, 'dd/MM/yyyy') }</span>
				)}/>
				<Column title='Consultorio' ellipsis render={({ medicalOffice }) => (
					<span>{ medicalOffice.name }</span>
				)}/>
				<Column title='Médico' ellipsis render={({ creatorUser }) => (
					<span>{ creatorUser.displayName }</span>
				)}/>
				<Column title='Estado' render={({ state }) => (
					<Tag color={state.color}>{state.name}</Tag>
				)}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => has('ReadClinicCare',
					<Link to={`/consulta/atencion/${id}`}>
						<Button shape='circle' type='text' size='small' className='table-toolbtn' icon={<MedicineBoxFilled style={{ color: '#2F8923' }}/>}/>
					</Link>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>
	)
}
