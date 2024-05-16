
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { NotAllowed } from '../../basic'

import { query, subscription } from './drug-class.constant'
import { CreateDrugClass, DeleteDrugClass, InspectDrugClass, UpdateDrugClass } from './drug-class-upsert.view'


export function DrugClassList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.DRUG_CLASESS, { onError })
		, [ drugClasess, filter ] = useFilter(addKey(data?.drugClasess), ['name', 'description'])
	const { Column } = Table

	useSubscription(subscription.DRUG_CLASS_UPSERTED, { onData: () => refetch() })

	return has('ReadDrugClass',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteDrugClass', <CreateDrugClass/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={drugClasess}
				bordered={true}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Descripción' dataIndex='description' ellipsis/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					<Space>
						{
							has('WriteDrugClass', <>
								<UpdateDrugClass id={id}/>
								<DeleteDrugClass id={id}/>
							</>)
						}
						<InspectDrugClass id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
