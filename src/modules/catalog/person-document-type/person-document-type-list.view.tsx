
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'

import { query, subscription } from './person-document-type.constant'
import { CreatePersonDocumentType, DeletePersonDocumentType, UpdatePersonDocumentType } from './person-document-type-upsert.view'


export function PersonDocumentTypeList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.PERSON_DOCUMENT_TYPES, { onError })
		, [ personDocumentTypes, filter ] = useFilter(addKey(data?.personDocumentTypes), ['name', 'description'])
	const { Column } = Table
	useSubscription(subscription.PERSON_DOCUMENT_TYPE_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>

				<ToolBarMenu>
					<CreatePersonDocumentType/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={personDocumentTypes}
				bordered={true}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name'/>
				<Column title='Descripción' dataIndex='description'/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='7rem' render={record => (
					<Space>
						<UpdatePersonDocumentType id={record.id}/>
						<DeletePersonDocumentType id={record.id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
