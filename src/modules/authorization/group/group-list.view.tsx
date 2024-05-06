

import { useQuery, useSubscription } from '@apollo/client'
import { Input, Table, Tag, Space } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useAntdHelp, useAuth, useError, useFilter } from '../../../hooks'
import { Permission, User } from '../../../types'
import { NotAllowed } from '../../basic'

import { query, subscription } from './group.constant'
import { CreateGroup, UpdateGroup } from './group-upsert.view'


export function GroupList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { has } = useAuth()
		, { loading, data, refetch } = useQuery(query.GROUPS, { onError })
		, [ groups, filter ] = useFilter(addKey(data?.groups), ['name', 'description'])
	const { Column } = Table

	useSubscription(subscription.GROUP_UPSERTED, { onData: () => refetch() })

	return has('R_GRP',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('W_GRP', <CreateGroup/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={groups}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Descripción' dataIndex='description' ellipsis/>
				<Column title='Permisos' render={group => group.permissions.map((permission: Permission) => (
					<div key={`group${group.id}-permission${permission.id}`}>
						<Tag>{ permission.description }</Tag>
					</div>
				))}/>
				<Column title='Miembros' render={group => group.members.map((user: User) => (
					<div key={`group${group.id}-member${user.id}`}>
						<Tag>{ user.userName }</Tag>
					</div>
				))}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={record => (
					<Space>
						{ has('W_GRP', <UpdateGroup id={record.id}/>) }
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error} />
		</>,
		<NotAllowed/>
	)
}
