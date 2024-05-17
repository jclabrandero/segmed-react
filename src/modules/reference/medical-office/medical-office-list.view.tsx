
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { NotAllowed } from '../../basic'

import { query, subscription } from './medical-office.constant'
import { CreateMedicalOffice, DeleteMedicalOffice, InspectMedicalOffice, UpdateMedicalOffice } from './medical-office-upsert.view'


export function MedicalOfficeList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.MEDICAL_OFFICES, { onError })
		, [ medicalOffices, filter ] = useFilter(addKey(data?.medicalOffices), ['name'])
	const { Column } = Table

	useSubscription(subscription.MEDICAL_OFFICE_UPSERTED, { onData: () => refetch() })

	return has('ReadMedicalOffice',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteMedicalOffice', <CreateMedicalOffice/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={medicalOffices}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Pertinencia' ellipsis render={({ belonging }) => (
					<span>{ belonging.name }</span>
				)}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					<Space>
						{
							has('WriteMedicalOffice', <>
								<UpdateMedicalOffice id={id}/>
								<DeleteMedicalOffice id={id}/>
							</>)
						}
						<InspectMedicalOffice id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
