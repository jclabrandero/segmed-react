
import { useQuery, useSubscription } from '@apollo/client'
import { Table, Input } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useFilter, useAntdHelp, useAuth, useDate } from '../../../hooks'
import { Batch } from '../../../types'

import { query, subscription } from './batch.constant'
import { CreateBatch } from './batch-upsert.view'

export function BatchList() {
	const { addKey } = useAntdHelp()
		, { has } = useAuth()
		, { format } = useDate()
	const [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.BATCHES, { onError })
		, [ batches, filter ] = useFilter(addKey<Batch>(data?.batches), ['code'])
	const { Column } = Table

	useSubscription(subscription.BATCH_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteBatch', <CreateBatch/>) }
				</ToolBarMenu>
			</ToolBar>
			<Table
				size='middle'
				dataSource={batches}
				bordered={ true }
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Código' dataIndex='code' ellipsis/>
				<Column title='Fecha de expiración' ellipsis render={({ expireAt }) => (
					<span>{format(expireAt, 'dd/MM/yyyy')}</span>
				)}/>
				<Column title='Medicamento' render={({ medication }) => (
					<span>{medication.code} - {medication.name} - {medication.concentration} - {medication.unit.name}</span>
				)}/>
			</Table>
			<ErrorDialog error={error}/>
		</>
	)
}
