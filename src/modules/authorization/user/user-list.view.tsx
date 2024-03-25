

import { useQuery, useSubscription } from '@apollo/client'
import { Input, Table, Tag, Space } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useAntdHelp, useError, useFilter } from '../../../hooks'

import { query, subscription } from './user.constant'
import { CreateUser, UpdateUser } from './user-upsert.view'


export function UserList() {
	const { addKey, estado } = useAntdHelp()
	const [ error, onError ] = useError()
	const { loading, data, refetch } = useQuery(query.USERS, { onError })
		, [ users, filter ] = useFilter(addKey(data?.users), ['userName', 'displayName'])
	const { Column } = Table
	useSubscription(subscription.USER_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					<CreateUser/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={users}
				bordered={true}
				pagination={{ pageSize: 15 }}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Usuario' dataIndex='userName'/>
				<Column title='Nombre' dataIndex='displayName'/>
				<Column title='Correo electrónico' dataIndex='email'/>
				<Column title='Estado' render={record => {
					const e = estado(record.status)
					return (<Tag color={ e.color }>{ e.label }</Tag>)
				}}/>
				<Column title='Acciones' width='7rem' render={usuario => (
					<Space>
						<UpdateUser id={usuario.id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error} />
		</>
	)
}
