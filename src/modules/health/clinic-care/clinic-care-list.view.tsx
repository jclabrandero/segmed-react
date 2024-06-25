
import { useQuery, useSubscription } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Button, Input, Table, Tag } from 'antd'
import { MedicineBoxFilled } from '@ant-design/icons'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useDate, useAntdHelp, useAuth } from '../../../hooks'
import { NotAllowed } from '../../basic'

import { CreateClinicCare } from './clinic-care-create.view'
import { query, subscription } from './clinic-care.constant'


export function ClinicCareList() {
	const [ error, onError ] = useError()
		, { has } = useAuth()
		, { loading, data, refetch } = useQuery(query.CLINIC_CARES, { onError })
		, { addKey } = useAntdHelp()
		, { format } = useDate()
	const { Search } = Input
	const { Column } = Table

	useSubscription(subscription.CLINIC_CARE_UPSERTED, { onData: () => refetch() })

	return has('ReadClinicCare',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Search enterButton/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteClinicCare', <CreateClinicCare/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={addKey(data?.clinicCares)}
				bordered={true}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Número' dataIndex='id'/>
				<Column title='Diagnóstico' render={({ primary }) => (
					<span>{ primary?.diagnosis }</span>
				)}/>
				<Column title='Cúdigo beneficiario' ellipsis render={({ insured }) => (
					<span>{ insured.code }</span>
				)}/>
				<Column title='Nombre beneficiario' ellipsis render={({ insured }) => (
					<span>{insured.person.firstName} {insured.person.lastName}</span>
				)}/>
				<Column title='Parentezco' ellipsis render={({ insured }) => (
					<span>{ insured.insuredType.name }</span>
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
					<Link to={`atencion/${id}`}>
						<Button shape='circle' type='text' size='small' className='table-toolbtn' icon={<MedicineBoxFilled style={{ color: '#2F8923' }}/>}/>
					</Link>
				)}/>
			</Table>

			<ErrorDialog error={error} />
		</>,
		<NotAllowed/>
	)
}
