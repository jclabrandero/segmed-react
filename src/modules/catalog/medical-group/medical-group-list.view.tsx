
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table, Tree } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { MedicalSpecialty } from '../../../types'
import { NotAllowed } from '../../basic'

import { query, subscription } from './medical-group.constant'
import { CreateMedicalGroup, DeleteMedicalGroup, InspectMedicalGroup, UpdateMedicalGroup } from './medical-group-upsert.view'


export function MedicalGroupList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.MEDICAL_GROUPS, { onError })
		, [ medicalGroups, filter ] = useFilter(addKey(data?.medicalGroups), ['name', 'description'])
	const { Column } = Table

	useSubscription(subscription.MEDICAL_GROUP_UPSERTED, { onData: () => refetch() })

	return has('ReadMedicalGroup',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteMedicalGroup', <CreateMedicalGroup/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={medicalGroups}
				bordered={true}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Descripción' dataIndex='description' ellipsis/>
				<Column title='Especialidades' ellipsis render={({ id, specialties }) => (
					<Tree treeData={specialties.map((specialty: MedicalSpecialty) => ({
						key: `${id}-${specialty.id}`,
						title: specialty.name,
						children: specialty.subspecialties.map(sbsp => ({
							key: `${id}-${specialty.id}-${sbsp.id}`,
							title: sbsp.name
						}))
					}))}/>
				)}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' render={({ id }) => (
					<Space>
						{
							has('WriteMedicalGroup', <>
								<UpdateMedicalGroup id={id}/>
								<DeleteMedicalGroup id={id}/>
							</>)
						}
						<InspectMedicalGroup id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
