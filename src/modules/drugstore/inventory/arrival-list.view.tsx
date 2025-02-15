
import { useQuery, useSubscription } from '@apollo/client'
import { Table, Input, Space, Tag } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useFilter, useAntdHelp, useAuth, useDate } from '../../../hooks'
import { Arrival, ArrivalItem } from '../../../types'

import { query, subscription } from './inventory.constant'
import { ConfirmApproveArrival, ConfirmCloseArrival, CreateArrival, CreateArrivalItem, DeleteArrival, DeleteArrivalItem, UpdateArrival, UpdateArrivalItem } from './arrival-upsert.view'

function ArrivalItemList({ arrival }: { arrival: Arrival }) {
	const { addKey } = useAntdHelp()
		, { format } = useDate()
		, { has } = useAuth()
	const [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.ARRIVAL_ITEMS, { onError, variables: { arrivalId: arrival.id } })
	const { Column } = Table

	useSubscription(subscription.ARRIIVAL_ITEM_UPSERTED, { onData: () => refetch() })

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
				<Column title='Total' ellipsis dataIndex='total'/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					!arrival.closed &&
					<Space>
						{
							has('WriteInventory', <>
								<UpdateArrivalItem id={id}/>
								<DeleteArrivalItem id={id}/>
							</>)
						}
					</Space>
				)}/>
			</Table>
			<ErrorDialog error={error}/>
		</>
	)
}

function arrivalApprovalState(val: number, closed: boolean = false) {
	if (closed) return { label: 'Finalizado', color: 'blue' }
	switch(val) {
		case 0: return { label: 'Parcial', color: 'orange' }
		case 1: return { label: 'Aprobado', color: 'green' }
		default: return { label: 'Desconocido', color: 'gray' }
	}
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
							<ArrivalItemList arrival={arrival}/>
						</>)
					},
					rowExpandable: () => true
				}}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Observación' dataIndex='remark' ellipsis/>
				<Column title='Proveedor' ellipsis render={({ provider }) => (
					<span>{ provider && provider.businessName }</span>
				)}/>
				<Column title='NIT proveedor' ellipsis render={({ provider }) => (
					<span>{ provider && provider.nit }</span>
				)}/>
				<Column title='Número de factura' dataIndex='invoiceNumber' ellipsis/>
				<Column title='Código autorización' dataIndex='invoiceAuthorizationCode' ellipsis/>
				<Column title='Código control' dataIndex='invoiceControlCode' ellipsis/>
				<Column title='Fecha de ingreso' ellipsis render={({ arrivalDate }) => (
					<span>{format(arrivalDate, 'dd/MM/yyyy')}</span>
				)}/>
				<Column title='Total factura' dataIndex='invoiceTotalRefPrice' ellipsis/>
				<Column title='Total' dataIndex='total' ellipsis/>
				<Column title='Estado' render={(record) => {
					const e = arrivalApprovalState(record.approvalState, record.closed)
					return (<Tag color={ e.color }>{ e.label }</Tag>)
				}}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id, approvalState, closed }) => (
					<Space>
						{ has('WriteInventory', !closed && <>
							<CreateArrivalItem arrivalId={id}/>
							<UpdateArrival id={id}/>
							<DeleteArrival id={id}/> 
						</>) }
						{ has('ApproveArrival', approvalState == 0 && <ConfirmApproveArrival id={id}/>) }
						{ has('WriteInventory', approvalState == 1 && !closed && <ConfirmCloseArrival id={id}/>) }
					</Space>
				)}/>
			</Table>
			<ErrorDialog error={error}/>
		</>
	)
}
