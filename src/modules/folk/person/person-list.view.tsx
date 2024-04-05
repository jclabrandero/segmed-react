
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useDate, useError, useAntdHelp, useFilter } from '../../../hooks'

import { query, subscription } from './person.constant'
import { CreatePerson, DeletePerson, UpdatePerson } from './person-upsert.view'


export function PersonList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { format } = useDate()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.PERSONS, { onError })
		, [ persons, filter ] = useFilter(addKey(data?.persons), ['firstName', 'lastName'])
	const { Column } = Table
	useSubscription(subscription.PERSON_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					<CreatePerson/>
				</ToolBarMenu>
			</ToolBar>

			<Table size='middle' dataSource={persons} bordered={true} pagination={{ pageSize: 15 }}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombres' dataIndex='firstName'/>
				<Column title='Apellidos' dataIndex='lastName'/>
				<Column title='Sexo' dataIndex='sex'/>
				<Column title='Nacimiento' render={record => (
					<span>{format(record.birthDate, 'dd/MM/yyyy')}</span>
				)}/>
				<Column title='Tipo DI' render={record => (
					<span>{record.personDocumentType?.name}</span>
				)}/>
				<Column title='Número DI' dataIndex='documentNumber'/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' render={record => (
					<Space>
						<UpdatePerson id={record.id}/>
						<DeletePerson id={record.id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
