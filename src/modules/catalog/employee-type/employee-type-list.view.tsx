
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { NotAllowed } from '../../basic'

import { query, subscription } from './employee-type.constant'
import { CreateEmployeeType, DeleteEmployeeType, InspectEmployeeType, UpdateEmployeeType } from './employee-type-upsert.view'


export function EmployeeTypeList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.EMPLOYEE_TYPES, { onError })
		, [ employeeTypes, filter ] = useFilter(addKey(data?.employeeTypes), ['name', 'description'])
	const { Column } = Table

	useSubscription(subscription.EMPLOYEE_TYPE_UPSERTED, { onData: () => refetch() })

	return has('ReadEmployeeType',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteEmployeeType', <CreateEmployeeType/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={employeeTypes}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Descripción' dataIndex='description' ellipsis/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='7rem' render={({ id }) => has('WriteEmployeeType',
					<Space>
						{
							has('WriteEmployeeType', <>
								<UpdateEmployeeType id={id}/>
								<DeleteEmployeeType id={id}/>
							</>)
						}
						<InspectEmployeeType id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
