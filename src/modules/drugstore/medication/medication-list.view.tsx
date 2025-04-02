
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { Medication } from '../../../types'
import { NotAllowed } from '../../basic'

import { CreateMedication, InspectMedication, UpdateMedication } from './medication-upsert.view'
import { query, subscription } from './medication.constant'


export function MedicationList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.MEDICATIONS, { onError })
		, [ medications, filter ] = useFilter(addKey<Medication>(data?.medications), ['code', 'name'])
	const { Column } = Table

	useSubscription(subscription.MEDICATION_UPSERTED, { onData: () => refetch() })

	return has('ReadMedication',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter} onChange={(e) => filter(e.target.value)}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteMedication', <CreateMedication/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={medications}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Código' dataIndex='code' ellipsis/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Concentración' dataIndex='concentration' ellipsis/>
				<Column title='LiNaMe' ellipsis render={({ liname }) => (
					<span>{ liname ? 'Sí' : 'No' }</span>
				)}/>
				<Column title='Unidad' ellipsis render={({ unit }) => (
					<span>{ unit.name }</span>
				)}/>
				<Column title='Clase' ellipsis render={({ class: cls }) => (
					<span>{ cls.name }</span>
				)}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					<Space>
						{
							has('WriteMedication', <>
								<UpdateMedication id={id}/>
							</>)
						}
						<InspectMedication id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
