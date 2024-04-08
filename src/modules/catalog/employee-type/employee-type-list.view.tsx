
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'

import { query, subscription } from './employee-type.constant'
import { CreateEmployeeType, DeleteEmployeeType, UpdateEmployeeType } from './employee-type-upsert.view'


export function EmployeeTypeList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.EMPLOYEE_TYPES, { onError })
		, [ employeeTypes, filter ] = useFilter(addKey(data?.employeeTypes), ['name', 'description'])
	const { Column } = Table
	useSubscription(subscription.EMPLOYEE_TYPE_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>

				<ToolBarMenu>
					<CreateEmployeeType/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={employeeTypes}
				bordered={true}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name'/>
				<Column title='Descripción' dataIndex='description'/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='7rem' render={record => (
					<Space>
						<UpdateEmployeeType id={record.id}/>
						<DeleteEmployeeType id={record.id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
