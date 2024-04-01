

import { useQuery } from '@apollo/client'
import { Input, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useAntdHelp, useAuth, useError, useFilter } from '../../../hooks'
import { NotAllowed } from '../../basic'

import { query } from './permission.constant'


export function PermissionList() {
	const { addKey, tableStatus } = useAntdHelp()
	const [ error, onError ] = useError()
	const { has } = useAuth()
	const { loading, data } = useQuery(query.PERMISSIONS, { onError })
		, [ permissions, filter ] = useFilter(addKey(data?.permissions), ['code', 'description'])
	const { Column } = Table

	return has('R_PRMSSN',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton onSearch={filter}/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={permissions}
				bordered={true}
				pagination={{ pageSize: 15 }}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Código' dataIndex='code'/>
				<Column title='Descripción' dataIndex='description'/>
				<Column title='Estado' render={tableStatus}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error} />
		</>,
		<NotAllowed/>
	)
}
