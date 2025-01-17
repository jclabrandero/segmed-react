
import { useParams } from 'react-router-dom'
import { Card, Space, Tabs } from 'antd'
import { useQuery } from '@apollo/client'

import { ErrorDialog } from '../../../components'
import { useAuth, useError } from '../../../hooks'
import { NotAllowed } from '../../basic'
import { BatchList } from '../batch/batch-list.view'
import { query } from '../pharmacy/pharmacy.constant'

import { StockList } from './stock-list.view'
import { ArrivalList } from './arrival-list.view'
import { DepartureList } from './departure-list.view'
import { ReportList } from './report-list.view'

export function InventoryManage() {
	const id = Number(useParams().id)
	const { has } = useAuth()
	const [ error, onError ] = useError()
		, { data } = useQuery(query.PHARMACY, { onError, variables: { id } })

	return has('ReadPharmacy',
		<Space direction='vertical' className='clinic-care'>
			<Card size='small' title='Datos de la farmacia'>
				<h3>{data?.pharmacy.name}</h3>
			</Card>
			<Card size='small'>
				<Tabs items={[
					{
						key: 'a123',
						label: 'Stock',
						children: <StockList pharmacyId={id}/>
					},
					{
						key: 'a124',
						label: 'Ingresos',
						children: <ArrivalList pharmacyId={id}/>
					},
					{
						key: 'a125',
						label: 'Salidas',
						children: <DepartureList pharmacyId={id}/>
					},
					{
						key: 'a126',
						label: 'Lotes',
						children: <BatchList/>
					},
					{
						key: 'a127',
						label: 'Reportes',
						children: <ReportList pharmacyId={id}/>
					},
				]}/>
			</Card>
			<ErrorDialog error={error}/>
		</Space>,
		<NotAllowed/>
	)
}
