
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'

import { query, subscription } from './medical-office.constant'
import { CreateMedicalOffice, DeleteMedicalOffice, UpdateMedicalOffice } from './medical-office-upsert.view'


export function MedicalOfficeList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.MEDICAL_OFFICES, { onError })
		, [ medicalOffices, filter ] = useFilter(addKey(data?.medicalOffices), ['name'])
	const { Column } = Table
	useSubscription(subscription.MEDICAL_OFFICE_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>

				<ToolBarMenu>
					<CreateMedicalOffice/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={medicalOffices}
				bordered={true}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name'/>
				<Column title='Pertinencia' render={({ belonging }) => (
					<span>{ belonging.name }</span>
				)}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='7rem' render={record => (
					<Space>
						<UpdateMedicalOffice id={record.id}/>
						<DeleteMedicalOffice id={record.id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
