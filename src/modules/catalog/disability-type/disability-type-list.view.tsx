
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { NotAllowed } from '../../basic'

import { query, subscription } from './disability-type.constant'
import { CreateDisabilityType, DeleteDisabilityType, InspectDisabilityType, UpdateDisabilityType } from './disability-type-upsert.view'


export function DisabilityTypeList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.DISABILITY_TYPES, { onError })
		, [ disabilityTypes, filter ] = useFilter(addKey(data?.disabilityTypes), ['name', 'description'])
	const { Column } = Table

	useSubscription(subscription.DISABILITY_TYPE_UPSERTED, { onData: () => refetch() })

	return has('ReadDisabilityType',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteDisabilityType', <CreateDisabilityType/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={disabilityTypes}
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
							has('WriteDisabilityType', <>
								<UpdateDisabilityType id={id}/>
								<DeleteDisabilityType id={id}/>
							</>)
						}
						<InspectDisabilityType id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
