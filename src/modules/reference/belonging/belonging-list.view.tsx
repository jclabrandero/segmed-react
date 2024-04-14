
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'

import { query, subscription } from './belonging.constant'
import { CreateBelonging, DeleteBelonging, UpdateBelonging } from './belonging-upsert.view'


export function BelongingList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.BELONGINGS, { onError })
		, [ belongings, filter ] = useFilter(addKey(data?.belongings), ['name'])
	const { Column } = Table
	useSubscription(subscription.BELONGING_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>

				<ToolBarMenu>
					<CreateBelonging/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={belongings}
				bordered={true}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name'/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='7rem' render={record => (
					<Space>
						<UpdateBelonging id={record.id}/>
						<DeleteBelonging id={record.id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
