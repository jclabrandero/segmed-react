
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'

import { query, subscription } from './drug-class.constant'
import { CreateDrugClass, DeleteDrugClass, UpdateDrugClass } from './drug-class-upsert.view'


export function DrugClassList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.DRUG_CLASESS, { onError })
		, [ drugClasess, filter ] = useFilter(addKey(data?.drugClasess), ['name', 'description'])
	const { Column } = Table
	useSubscription(subscription.DRUG_CLASS_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>

				<ToolBarMenu>
					<CreateDrugClass/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={drugClasess}
				bordered={true}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name'/>
				<Column title='Descripción' dataIndex='description'/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='7rem' render={({ id }) => (
					<Space>
						<UpdateDrugClass id={id}/>
						<DeleteDrugClass id={id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
