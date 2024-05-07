
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Tag, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { MedicalOffice } from '../../../types'
import { NotAllowed } from '../../basic'

import { query, subscription } from './clerk.constant'
import { CreateClerk, DeleteClerk, UpdateClerk } from './clerk-upsert.view'


export function ClerkList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.CLERKS, { onError })
		, [ clerks, filter ] = useFilter(addKey(data?.clerks), ['ein'])
	const { Column } = Table

	useSubscription(subscription.CLERK_UPSERTED, { onData: () => refetch() })

	return has('R_CLRK',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('W_CLRK', <CreateClerk/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table size='middle' dataSource={clerks} bordered={true} pagination={{ pageSize: 15 }} scroll={{ x: true }} loading={loading}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Ficha' dataIndex='ein' ellipsis/>
				<Column title='Nombre funcionario' ellipsis render={clerk => (
					<span>{clerk.person.firstName} {clerk.person.lastName}</span>
				)}/>
				<Column title='Cargo' ellipsis render={clerk => (
					<span>{ clerk.position.name }</span>
				)}/>
				<Column title='Tipo' ellipsis render={clerk => (
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
				<Column title='Acciones' width='6rem' fixed='right' render={record => has('W_CLRK',
					<Space>
						<UpdateClerk id={record.id}/>
						<DeleteClerk id={record.id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
