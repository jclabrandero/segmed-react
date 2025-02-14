
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { NotAllowed } from '../../basic'
import { Provider } from '../../../types'

import { CreateProvider, InspectProvider, UpdateProvider, DeleteProvider } from './provider-upsert.view'
import { query, subscription } from './provider.constant'


export function ProviderList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.PROVIDERS, { onError })
		, [ providers, filter ] = useFilter(addKey(data?.providers), ['vendorCode', 'businessName', 'nit'])
	const { Column } = Table

	useSubscription(subscription.PROVIDER_UPSERTED, { onData: () => refetch() })

	return has('ReadProvider',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteProvider', <CreateProvider/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={providers as Array<Provider>}
				bordered={ true }
				pagination={{ pageSize: 15 }}
				scroll={{x: true}}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Código vendor' dataIndex='vendorCode' ellipsis/>
				<Column title='Razón social' dataIndex='businessName' ellipsis/>
				<Column title='Pertinencia' ellipsis render={({ belonging }) => (
					<span>{ belonging.name }</span>
				)}/>
				<Column title='NIT' dataIndex='nit' ellipsis/>
				<Column title='Dirección' dataIndex='address' ellipsis/>
				<Column title='Teléfono' dataIndex='phone' ellipsis/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					<Space>
						{
							has('WriteProvider', <>
								<UpdateProvider id={id}/>
								<DeleteProvider id={id}/>
							</>)
						}
						<InspectProvider id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error} />
		</>,
		<NotAllowed/>
	)
}
