
import { useQuery, useSubscription } from '@apollo/client'
import { Table, Input, Space } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useFilter, useAntdHelp, useAuth, useDate } from '../../../hooks'
import { Departure, DepartureItem } from '../../../types'

import { query, subscription } from './inventory.constant'
import { CreateDeparture, CreateDepartureItem, CreateDepartureItemPrescription } from './departure-upsert.view'

function DepartureItemList({ departureId }: { departureId: number }) {
	const { addKey } = useAntdHelp()
		, { format } = useDate()
	const [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.DEPARTURE_ITEMS, { onError, variables: { departureId } })
	const { Column } = Table

	useSubscription(subscription.DEPARTURE_ITEM_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<Table
				size='small'
				dataSource={addKey<DepartureItem>(data?.departureItems)}
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

export function DepartureList({ pharmacyId }: { pharmacyId: number }) {
	const { addKey } = useAntdHelp()
		, { has } = useAuth()
		, { format } = useDate()
	const [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.DEPARTURES, { onError, variables: { pharmacyId } })
		, [ departures, filter ] = useFilter(addKey<Departure>(data?.departures), ['remark'])
	const { Column } = Table

	useSubscription(subscription.DEPARTURE_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteInventory', <CreateDeparture pharmacyId={pharmacyId}/>) }
				</ToolBarMenu>
			</ToolBar>
			<Table
				size='middle'
				dataSource={departures}
				bordered={ true }
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
				expandable={{
					expandedRowRender: (departure) => {
						return (<>
							<div></div>
							<DepartureItemList departureId={departure.id}/>
						</>)
					},
					rowExpandable: () => true
				}}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Observación' dataIndex='remark' ellipsis/>
				<Column title='Fecha de salida' ellipsis render={({ departureDate }) => (
					<span>{format(departureDate, 'dd/MM/yyyy')}</span>
				)}/>
				<Column title='Consulta' ellipsis render={({ clinicCare }) => clinicCare ? (
					<span>Consulta N° { clinicCare.id } - {clinicCare.insured.person.firstName} {clinicCare.insured.person.lastName}</span>
				) : null }/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id, clinicCare }) => (
					<Space>
						{
							clinicCare
								? <CreateDepartureItemPrescription clinicCareId={clinicCare.id} departureId={id} pharmacyId={pharmacyId}/>
								: <CreateDepartureItem departureId={id} pharmacyId={pharmacyId}/>
						}
					</Space>
				)}/>
			</Table>
			<ErrorDialog error={error}/>
		</>
	)
}
