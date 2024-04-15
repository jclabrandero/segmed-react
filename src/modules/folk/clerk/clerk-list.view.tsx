
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Tag, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'
import { MedicalOffice } from '../../../types'

import { query, subscription } from './clerk.constant'
import { CreateClerk, DeleteClerk, UpdateClerk } from './clerk-upsert.view'


export function ClerkList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.CLERKS, { onError })
		, [ clerks, filter ] = useFilter(addKey(data?.clerks), ['ein'])
	const { Column } = Table

	useSubscription(subscription.CLERK_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					<CreateClerk/>
				</ToolBarMenu>
			</ToolBar>

			<Table size='middle' dataSource={clerks} bordered={true} pagination={{ pageSize: 15 }}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Ficha' dataIndex='ein'/>
				<Column title='Nombre funcionario' render={clerk => (
					<span>{clerk.person.firstName} {clerk.person.lastName}</span>
				)}/>
				<Column title='Cargo' render={clerk => (
					<span>{ clerk.position.name }</span>
				)}/>
				<Column title='Tipo' render={clerk => (
					<span>{ clerk.employeeType.name }</span>
				)}/>
				<Column title='Oficinas' render={() => (
					<span></span>
				)}/>
				<Column title='Consultorios' render={clerk => clerk.medicalOffices.map((mo: MedicalOffice) => (
					<div key={`clrk${clerk.id}-mo${mo.id}`}>
						<Tag>{ mo.name }</Tag>
					</div>
				))}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' render={record => (
					<Space>
						<UpdateClerk id={record.id}/>
						<DeleteClerk id={record.id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
