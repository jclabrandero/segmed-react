
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { NotAllowed } from '../../basic'

import { query, subscription } from './belonging.constant'
import { CreateBelonging, DeleteBelonging, InspectBelonging, UpdateBelonging } from './belonging-upsert.view'


export function BelongingList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.BELONGINGS, { onError })
		, [ belongings, filter ] = useFilter(addKey(data?.belongings), ['name'])
	const { Column } = Table

	useSubscription(subscription.BELONGING_UPSERTED, { onData: () => refetch() })

	return has('ReadBelonging',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteBelonging', <CreateBelonging/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={belongings}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					<Space>
						{
							has('WriteBelonging', <>
								<UpdateBelonging id={id}/>
								<DeleteBelonging id={id}/>
							</>)
						}
						<InspectBelonging id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
