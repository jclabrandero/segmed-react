import { useQuery, useSubscription } from '@apollo/client'
import { Table, Input, Space, Tag } from 'antd'
import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useFilter, useAntdHelp, useAuth, useDate } from '../../../hooks'
import { query, subscription } from './interclinical.constant'
import { CreateInterclinicalCost, UpdateInterclinicalCost, DeleteInterclinicalCost, CreateInterclinicalCostItem, UpdateInterclinicalCostItem, DeleteInterclinicalCostItem } from './interclinical-cost-upsert.view'
import { InterclinicalCost, InterclinicalCostItem } from '../../../types/interclinical.types'

function InterclinicalCostItemList({ interclinicalCost }: { interclinicalCost: InterclinicalCost }) {
	const { addKey } = useAntdHelp()
	const { format } = useDate()
	const { has } = useAuth()
	const [ error, onError ] = useError()
	const { loading, data, refetch } = useQuery(query.INTERCLINICAL_COST_ITEMS, { onError, variables: { interclinicalCostId: interclinicalCost.id } })
	const { Column } = Table

	useSubscription(subscription.INTERCLINICAL_COST_ITEM_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<Table
				size='small'
				dataSource={addKey<InterclinicalCostItem>(data?.interclinicalCostItems)}
				bordered={ true }
				loading={loading}
				pagination={{ hideOnSinglePage: true }}>
				<Column title='Fecha sesión' ellipsis render={({ sesionDate }) => sesionDate ? format(sesionDate, 'DD/MM/YYYY') : ''}/>
				<Column title='Descripción' dataIndex='description' ellipsis/>
				<Column title='Cantidad' dataIndex='quantity'/>
				<Column title='Tarifa' dataIndex='priceTariff'/>
				<Column title='Precio' dataIndex='price'/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					!interclinicalCost.closed &&
				<Space>
					{ has('WriteInterclinicalCost', <>
						<UpdateInterclinicalCostItem id={id}/>
						<DeleteInterclinicalCostItem id={id}/>
					</>) }
				</Space>
				)}/>
			</Table>
			<ErrorDialog error={error}/>
		</>
	)
}

export default function InterclinicalCostList() {
	const { addKey } = useAntdHelp()
	const { has } = useAuth()
	const { format } = useDate()
	const [ error, onError ] = useError()
	const { loading, data, refetch } = useQuery(query.INTERCLINICAL_LIST, { onError })
	const [ costs, filter ] = useFilter(addKey<InterclinicalCost>(data?.interclinicalCosts), ['invoiceNumber'])
	const { Column } = Table

	useSubscription(subscription.INTERCLINICAL_COST_ITEM_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					<CreateInterclinicalCost/>
				</ToolBarMenu>
			</ToolBar>
			<Table
				size='middle'
				dataSource={costs}
				bordered={ true }
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
				expandable={{
					expandedRowRender: (cost) => (
						<>
							<InterclinicalCostItemList interclinicalCost={cost}/>
						</>
					),
					rowExpandable: () => true
				}}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Proveedor' ellipsis render={({ provider }) => provider?.businessName}/>
				<Column title='NIT proveedor' ellipsis render={({ provider }) => provider?.nit}/>
				<Column title='N° factura' dataIndex='invoiceNumber'/>
				<Column title='Fecha factura' render={({ invoiceDate }) => format(invoiceDate, 'DD/MM/YYYY')}/>
				<Column title='Total factura' dataIndex='invoiceTotalRefPrice'/>
				<Column title='Estado' render={({ status }) => <Tag color={status === 1 ? 'green' : 'gray'}>{status === 1 ? 'Activo' : 'Inactivo'}</Tag>}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					<Space>
						{ has('WriteInterclinicalCost', <>
							<UpdateInterclinicalCost id={id}/>
							<DeleteInterclinicalCost id={id}/>
						</>) }
					</Space>
				)}/>
			</Table>
			<ErrorDialog error={error}/>
		</>
	)
}