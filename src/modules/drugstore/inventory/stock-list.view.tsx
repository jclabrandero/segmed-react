
import { useQuery } from '@apollo/client'
import { Table, Input } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useFilter, useAntdHelp } from '../../../hooks'
import { Pharmacy } from '../../../types'

import { query } from './inventory.constant'

export function StockList({ pharmacyId }: { pharmacyId: number }) {
	const { addKey } = useAntdHelp()
	const [ error, onError ] = useError()
		, { loading, data } = useQuery(query.INVENTORIES, { onError, variables: { pharmacyId } })
		, [ inventories, filter ] = useFilter(addKey<Pharmacy>(data?.inventories), ['stock', 'medication.code', 'medication.name'])
	const { Column } = Table

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter} onChange={(e) => filter(e.target.value)}/>
				</ToolBarMenu>
				<ToolBarMenu>
					<></>
				</ToolBarMenu>
			</ToolBar>
			<Table
				size='middle'
				pagination={false}
				bordered={true}
				scroll={{ x: true }}
				dataSource={inventories}
				loading={loading}
			>
				<Column title='Código' render={({ medication }) => (
					<span>{ medication.code }</span>
				)}/>
				<Column title='Nombre' ellipsis render={({ medication }) => (
					<span>{ medication.name }</span>
				)}/>
				<Column title='Concentración' ellipsis render={({ medication }) => (
					<span>{ medication.concentration }</span>
				)}/>
				<Column title='Unidad' ellipsis render={({ medication }) => (
					<span>{ medication.unit.name }</span>
				)}/>
				<Column title='Stock' dataIndex='stock'/>
				<Column title='Costo' ellipsis render={({ price } : { price: string }) => (
					<span>{ Number(price).toFixed(6) }</span>
				)}/>
				<Column title='Mínimo' dataIndex='min'/>
			</Table>

			<ErrorDialog error={error}/>
		</>
	)
}
