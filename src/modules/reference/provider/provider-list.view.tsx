
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'

import { CreateProvider, UpdateProvider } from './provider-upsert.view'
import { query, subscription } from './provider.constant'


export function ProviderList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.PROVIDERS, { onError })
		, [ providers, filter ] = useFilter(addKey(data?.providers), ['vendorCode', 'businessName', 'nit'])
	const { Column } = Table

	useSubscription(subscription.PROVIDER_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					<CreateProvider/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={providers}
				bordered={ true }
				pagination={{ pageSize: 15 }}
				scroll={{x: true}}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Código vendor' dataIndex='vendorCode' className='table-cell-nowrap'/>
				<Column title='Razón social' dataIndex='businessName' className='table-cell-nowrap'/>
				<Column title='Pertinencia' className='table-cell-nowrap' render={({ belonging }) => (
					<span>{ belonging.name }</span>
				)}/>
				<Column title='NIT' dataIndex='nit'/>
				<Column title='Dirección' dataIndex='address' className='table-cell-nowrap'/>
				<Column title='Teléfono' dataIndex='phone' className='table-cell-nowrap'/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='7rem' fixed='right' render={({ id }) => (
					<Space>
						<UpdateProvider id={id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error} />
		</>
	)
}
