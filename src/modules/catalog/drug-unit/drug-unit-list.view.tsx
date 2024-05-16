
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { NotAllowed } from '../../basic'

import { query, subscription } from './drug-unit.constant'
import { CreateDrugUnit, DeleteDrugUnit, InspectDrugUnit, UpdateDrugUnit } from './drug-unit-upsert.view'


export function DrugUnitList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.DRUG_UNITS, { onError })
		, [ drugUnits, filter ] = useFilter(addKey(data?.drugUnits), ['name', 'description'])
	const { Column } = Table

	useSubscription(subscription.DRUG_UNIT_UPSERTED, { onData: () => refetch() })

	return has('ReadDrugUnit',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteDrugUnit', <CreateDrugUnit/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={drugUnits}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Descripción' dataIndex='description' ellipsis/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='7rem' render={({ id }) => (
					<Space>
						{
							has('WriteDrugUnit', <>
								<UpdateDrugUnit id={id}/>
								<DeleteDrugUnit id={id}/>
							</>)
						}
						<InspectDrugUnit id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
