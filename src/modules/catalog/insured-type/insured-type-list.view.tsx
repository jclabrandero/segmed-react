
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { NotAllowed } from '../../basic'
import { InsuredType } from '../../../types'

import { CreateInsuredType, DeleteInsuredType, InspectInsuredType, UpdateInsuredType } from './insured-type-upsert.view'
import { query, subscription } from './insured-type.constant'


export function InsuredTypeList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery<{ insuredTypes: Array<InsuredType>}>(query.INSURED_TYPES, { onError })
		, [ insuredTypes, filter ] = useFilter(addKey(data?.insuredTypes), ['name', 'description'])
		, { Column } = Table

	useSubscription(subscription.INSURED_TYPE_UPSERTED, { onData: () => refetch() })

	return has('ReadInsuredType',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteInsuredType', <CreateInsuredType/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={insuredTypes}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Descripción' dataIndex='description' ellipsis/>
				<Column title='Con dependientes' render={({ withDependents }: InsuredType) => (
					<span>{withDependents ? 'Sí' : 'No'}</span>
				)}/>
				<Column title='Formato de código' dataIndex='codeFormat' ellipsis/>
				<Column title='Edad de baja' dataIndex='outletAge' ellipsis/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					<Space>
						{
							has('WriteInsuredType', <>
								<UpdateInsuredType id={id}/>
								<DeleteInsuredType id={id}/>
							</>)
						}
						<InspectInsuredType id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
