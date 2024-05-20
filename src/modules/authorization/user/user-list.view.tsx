

import { useQuery, useSubscription } from '@apollo/client'
import { Input, Table, Tag, Space } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useAntdHelp, useAuth, useError, useFilter } from '../../../hooks'
import { Group } from '../../../types'
import { NotAllowed } from '../../basic'

import { query, subscription } from './user.constant'
import { CreateUser, UpdateUser } from './user-upsert.view'


export function UserList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { has } = useAuth()
		, { loading, data, refetch } = useQuery(query.USERS, { onError })
		, [ users, filter ] = useFilter(addKey(data?.users), ['userName', 'displayName'])
	const { Column } = Table

	useSubscription(subscription.USER_UPSERTED, { onData: () => refetch() })

	return has('ReadUser',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteUser', <CreateUser/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={users}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Usuario' dataIndex='userName'/>
				<Column title='Nombre' dataIndex='displayName' ellipsis/>
				<Column title='Correo electrónico' dataIndex='email' ellipsis/>
				<Column title='Grupos' render={({ id, groups }) => groups.map((group: Group) => (
					<div key={`user${id}-group${group.id}`}>
						<Tag>{ group.name }</Tag>
					</div>
				))}/>
				<Column title='Funcionario' render={({ clerk }) => clerk ?
					(<Tag>{clerk.person.firstName} {clerk.person.lastName}</Tag>) : null
				}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					<Space>
						{ has('WriteUser', <UpdateUser id={id}/>) }
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error} />
		</>,
		<NotAllowed/>
	)
}
