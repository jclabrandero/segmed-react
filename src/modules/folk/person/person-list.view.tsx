
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useAuth, useDate, useError, useAntdHelp, useFilter } from '../../../hooks'
import { NotAllowed } from '../../basic'

import { subscription as pdtSubscription } from '../../catalog/person-document-type/person-document-type.constant'
import { query, subscription } from './person.constant'
import { CreatePerson, DeletePerson, UpdatePerson } from './person-upsert.view'


export function PersonList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { format } = useDate()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.PERSONS, { onError })
		, [ persons, filter ] = useFilter(addKey(data?.persons), ['firstName', 'lastName'])
	const { Column } = Table

	useSubscription(pdtSubscription.PERSON_DOCUMENT_TYPE_UPSERTED, { onData: () => refetch() })
	useSubscription(subscription.PERSON_UPSERTED, { onData: () => refetch() })

	return has('R_PRSN',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('W_PRSN', <CreatePerson/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table size='middle' dataSource={persons} bordered={true} pagination={{ pageSize: 15 }} scroll={{ x: true }} loading={loading}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombres' dataIndex='firstName' ellipsis/>
				<Column title='Apellidos' dataIndex='lastName' ellipsis/>
				<Column title='Sexo' dataIndex='sex' ellipsis/>
				<Column title='Nacimiento' ellipsis render={record => (
					<span>{format(record.birthDate, 'dd/MM/yyyy')}</span>
				)}/>
				<Column title='Tipo DI' ellipsis render={record => (
					<span>{record.personDocumentType?.name}</span>
				)}/>
				<Column title='Número DI' ellipsis dataIndex='documentNumber'/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={record => has('W_PRSN',
					<Space>
						<UpdatePerson id={record.id}/>
						<DeletePerson id={record.id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
