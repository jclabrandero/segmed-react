
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { NotAllowed } from '../../basic'

import { query, subscription } from './employee-position.constant'
import { CreateEmployeePosition, DeleteEmployeePosition, InspectEmployeePosition, UpdateEmployeePosition } from './employee-position-upsert.view'


export function EmployeePositionList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.EMPLOYEE_POSITIONS, { onError })
		, [ employeePositions, filter ] = useFilter(addKey(data?.employeePositions), ['name', 'description'])
	const { Column } = Table

	useSubscription(subscription.EMPLOYEE_POSITION_UPSERTED, { onData: () => refetch() })

	return has('ReadEmployeePosition',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteEmployeePosition', <CreateEmployeePosition/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={employeePositions}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Descripción' dataIndex='description' ellipsis/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' render={({ id }) => (
					<Space>
						{
							has('WriteEmployeePosition',<>
								<UpdateEmployeePosition id={id}/>
								<DeleteEmployeePosition id={id}/>
							</>)
						}
						<InspectEmployeePosition id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
