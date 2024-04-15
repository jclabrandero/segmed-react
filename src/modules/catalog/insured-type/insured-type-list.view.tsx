
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'

import { CreateInsuredType, DeleteInsuredType, UpdateInsuredType } from './insured-type-upsert.view'
import { query, subscription } from './insured-type.constant'


export function InsuredTypeList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.INSURED_TYPES, { onError })
		, [ insuredTypes, filter ] = useFilter(addKey(data?.insuredTypes), ['name'])
		, { Column } = Table

	useSubscription(subscription.INSURED_TYPE_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					<CreateInsuredType/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={insuredTypes}
				bordered={true}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name'/>
				<Column title='Descripción' dataIndex='description'/>
				<Column title='Con dependientes' render={record => (
					<span>{record.withDependents ? 'Sí' : 'No'}</span>
				)}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' render={record => (
					<Space>
						<UpdateInsuredType id={record.id}/>
						<DeleteInsuredType id={record.id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
