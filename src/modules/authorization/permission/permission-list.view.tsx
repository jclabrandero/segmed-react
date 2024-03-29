

import { useQuery } from '@apollo/client'
import { Input, Table, Tag } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useAntdHelp, useError, useFilter } from '../../../hooks'

import { query } from './permission.constant'


export function PermissionList() {
	const { addKey, estado } = useAntdHelp()
	const [ error, onError ] = useError()
	const { loading, data } = useQuery(query.PERMISSIONS, { onError })
		, [ permissions, filter ] = useFilter(addKey(data?.permissions), ['code', 'description'])
	const { Column } = Table

	return (
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
				<Column title='Estado' render={record => {
					const e = estado(record.status)
					return (<Tag color={ e.color }>{ e.label }</Tag>)
				}}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error} />
		</>
	)
}
