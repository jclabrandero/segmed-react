
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table, Tag } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'

import { query, subscription } from './medical-group.constant'
import { CreateMedicalGroup, DeleteMedicalGroup, UpdateMedicalGroup } from './medical-group-upsert.view'


export function MedicalGroupList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.MEDICAL_GROUPS, { onError })
		, [ medicalGroups, filter ] = useFilter(addKey(data?.medicalGroups), ['name'])
	const { Column } = Table

	useSubscription(subscription.MEDICAL_GROUP_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					<CreateMedicalGroup/>
				</ToolBarMenu>
			</ToolBar>

			<Table size='middle' dataSource={medicalGroups} bordered={true} pagination={{ pageSize: 15 }}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name'/>
				<Column title='Descripción' dataIndex='description'/>
				<Column title='Especialidades' render={({ id, specialties }) => specialties.map((sp: { id: number, name: string }) => (
					<Tag key={`${id}-${sp.id}`}>{sp.name}</Tag>
				))}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' render={({ id }) => (
					<Space>
						<UpdateMedicalGroup id={id}/>
						<DeleteMedicalGroup id={id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
