
import { useQuery, useSubscription } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Button, Input, Table, Tag } from 'antd'
import { MedicineBoxFilled } from '@ant-design/icons'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useDate, useAntdHelp } from '../../../hooks'

import { CreateClinicCare } from './clinic-care-create.view'
import { query, subscription } from './clinic-care.constant'


export function ClinicCareList() {
	const [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.CLINIC_CARES, { onError })
		, { addKey } = useAntdHelp()
		, { format } = useDate()
	const { Search } = Input
	const { Column } = Table
	useSubscription(subscription.CLINIC_CARE_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Search enterButton/>
				</ToolBarMenu>
				<ToolBarMenu>
					<CreateClinicCare/>
				</ToolBarMenu>
			</ToolBar>

			<Table size='middle' dataSource={addKey(data?.clinicCares)} bordered={true}>
				<Column title='Numero' dataIndex='id'/>
				<Column title='Motivo' render={({ primary }) => (
					<span>{ primary?.reason }</span>
				)}/>
				<Column title='Codigo beneficiario' render={({ insured }) => (
					<span>{ insured.code }</span>
				)}/>
				<Column title='Nombre beneficiario' render={({ insured }) => (
					<span>{insured.person.firstName} {insured.person.lastName}</span>
				)}/>
				<Column title='Parentezco' render={({ insured }) => (
					<span>{ insured.insuredType.name }</span>
				)}/>
				<Column title='Fecha de inicio' render={({ startDate }) => (
					<span>{ format(startDate, 'dd/MM/yyyy') }</span>
				)}/>
				<Column title='Consultorio' render={({ medicalOffice }) => (
					<span>{ medicalOffice.name }</span>
				)}/>
				<Column title='Estado' render={({ state }) => (
					<Tag color={state.color}>{state.name}</Tag>
				)}/>
				<Column title='Acciones' width='7rem' render={({ id }) => (
					<Link to={`atencion/${id}`}>
						<Button shape='circle' type='text' size='small' className='table-toolbtn' icon={<MedicineBoxFilled style={{ color: '#2F8923' }}/>}/>
					</Link>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error} />
		</>
	)
}
