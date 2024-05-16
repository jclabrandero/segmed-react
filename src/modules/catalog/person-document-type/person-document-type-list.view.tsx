
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { NotAllowed } from '../../basic'

import { query, subscription } from './person-document-type.constant'
import { CreatePersonDocumentType, DeletePersonDocumentType, InspectPersonDocumentType, UpdatePersonDocumentType } from './person-document-type-upsert.view'


export function PersonDocumentTypeList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.PERSON_DOCUMENT_TYPES, { onError })
		, [ personDocumentTypes, filter ] = useFilter(addKey(data?.personDocumentTypes), ['name', 'description'])
	const { Column } = Table

	useSubscription(subscription.PERSON_DOCUMENT_TYPE_UPSERTED, { onData: () => refetch() })

	return has('ReadPersonDocumentType',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WritePersonDocumentType', <CreatePersonDocumentType/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={personDocumentTypes}
				bordered={true}
				pagination={{ pageSize: 15 }}
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
							has('WritePersonDocumentType', <>
								<UpdatePersonDocumentType id={id}/>
								<DeletePersonDocumentType id={id}/>
							</>)
						}
						<InspectPersonDocumentType id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
