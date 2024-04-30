
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'
import { Medication } from '../../../types'

import { CreateMedication, UpdateMedication } from './medication-upsert.view'
import { query, subscription } from './medication.constant'


export function MedicationList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.MEDICATIONS, { onError })
		, [ medications, filter ] = useFilter(addKey<Medication>(data?.medications), ['code', 'name'])
	const { Column } = Table
	useSubscription(subscription.MEDICATION_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>

				<ToolBarMenu>
					<CreateMedication/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={medications}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{x: true}}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Código' dataIndex='code'/>
				<Column title='Nombre' dataIndex='name' className='table-cell-nowrap'/>
				<Column title='Concentración' dataIndex='concentration' className='table-cell-nowrap'/>
				<Column title='LiNaMe' render={({ liname }) => (
					<span>{ liname ? 'Sí' : 'No' }</span>
				)}/>
				<Column title='Unidad' className='table-cell-nowrap' render={({ unit }) => (
					<span>{ unit.name }</span>
				)}/>
				<Column title='Clase' className='table-cell-nowrap' render={({ class: cls }) => (
					<span>{ cls.name }</span>
				)}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='7rem' fixed='right' render={({ id }) => (
					<Space>
						<UpdateMedication id={id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
