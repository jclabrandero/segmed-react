
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'

import { query, subscription } from './employee-position.constant'
import { CreateEmployeePosition, DeleteEmployeePosition, UpdateEmployeePosition } from './employee-position-upsert.view'


export function EmployeePositionList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.EMPLOYEE_POSITIONS, { onError })
		, [ employeePositions, filter ] = useFilter(addKey(data?.employeePositions), ['name', 'description'])
	const { Column } = Table
	useSubscription(subscription.EMPLOYEE_POSITION_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>

				<ToolBarMenu>
					<CreateEmployeePosition/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={employeePositions}
				bordered={true}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name'/>
				<Column title='Descripción' dataIndex='description'/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='7rem' render={record => (
					<Space>
						<UpdateEmployeePosition id={record.id}/>
						<DeleteEmployeePosition id={record.id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
