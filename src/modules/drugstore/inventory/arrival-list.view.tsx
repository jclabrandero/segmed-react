
import { useQuery, useSubscription } from '@apollo/client'
import { Table, Input, Space } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useFilter, useAntdHelp, useAuth, useDate } from '../../../hooks'
import { Arrival, ArrivalItem } from '../../../types'

import { query, subscription } from './inventory.constant'
import { CreateArrival, CreateArrivalItem } from './arrival-upsert.view'

function ArrivalItemList({ arrivalId }: { arrivalId: number }) {
	const { addKey } = useAntdHelp()
		, { format } = useDate()
	const [ error, onError ] = useError()
		, { loading, data } = useQuery(query.ARRIVAL_ITEMS, { onError, variables: { arrivalId } })
	const { Column } = Table

	return (
		<>
			<Table
				size='small'
				dataSource={addKey<ArrivalItem>(data?.arrivalItems)}
				bordered={ true }
				loading={loading}
				pagination={{ hideOnSinglePage: true }}>
				<Column title='Lote' ellipsis render={({ batch }) => batch.code}/>
				<Column title='Medicamento' ellipsis render={({ batch }) => {
					const { code, name, concentration, unit} = batch.medication
					return `${code} - ${name} - ${concentration} - ${unit.name}`
				}}/>
				<Column title='Fecha de expiración' ellipsis render={({ batch }) => format(batch.expireAt, 'dd/MM/yyyy')}/>
				<Column title='Cantidad' ellipsis dataIndex='quantity'/>
				<Column title='Precio' ellipsis dataIndex='price'/>
				
			</Table>
			<ErrorDialog error={error}/>
		</>
	)
}

export function ArrivalList({ pharmacyId }: { pharmacyId: number }) {
	const { addKey } = useAntdHelp()
		, { has } = useAuth()
		, { format } = useDate()
	const [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.ARRIVALS, { onError, variables: { pharmacyId } })
		, [ arrivals, filter ] = useFilter(addKey<Arrival>(data?.arrivals), ['remark'])
	const { Column } = Table

	useSubscription(subscription.ARRIVAL_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteInventory', <CreateArrival pharmacyId={pharmacyId}/>) }
				</ToolBarMenu>
			</ToolBar>
			<Table
				size='middle'
				dataSource={arrivals}
				bordered={ true }
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
				expandable={{
					expandedRowRender: (arrival) => {
						return (<>
							<div></div>
							<ArrivalItemList arrivalId={arrival.id}/>
						</>)
					},
					rowExpandable: () => true
				}}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Observación' dataIndex='remark' ellipsis/>
				<Column title='Fecha de ingreso' ellipsis render={({ arrivalDate }) => (
					<span>{format(arrivalDate, 'dd/MM/yyyy')}</span>
				)}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					<Space>
						<CreateArrivalItem arrivalId={id}/>
					</Space>
				)}/>
			</Table>
			<ErrorDialog error={error}/>
		</>
	)
}
