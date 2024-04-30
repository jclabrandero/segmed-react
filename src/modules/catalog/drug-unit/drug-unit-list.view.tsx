
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'

import { query, subscription } from './drug-unit.constant'
import { CreateDrugUnit, DeleteDrugUnit, UpdateDrugUnit } from './drug-unit-upsert.view'


export function DrugUnitList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.DRUG_UNITS, { onError })
		, [ drugUnits, filter ] = useFilter(addKey(data?.drugUnits), ['name', 'description'])
	const { Column } = Table
	useSubscription(subscription.DRUG_UNIT_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>

				<ToolBarMenu>
					<CreateDrugUnit/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={drugUnits}
				bordered={true}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name'/>
				<Column title='Descripción' dataIndex='description'/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='7rem' render={({ id }) => (
					<Space>
						<UpdateDrugUnit id={id}/>
						<DeleteDrugUnit id={id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
