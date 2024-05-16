
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table, Tree } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { MedicalSubspecialty } from '../../../types'
import { NotAllowed } from '../../basic'

import { query, subscription } from './medical-specialty.constant'
import { CreateMedicalSpecialty, DeleteMedicalSpecialty, InspectMedicalSpecialty, UpdateMedicalSpecialty } from './medical-specialty-upsert.view'


export function MedicalSpecialtyList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.MEDICAL_SPECIALTIES, { onError })
		, [ medicalSpecialties, filter ] = useFilter(addKey(data?.medicalSpecialties), ['name', 'description'])
	const { Column } = Table

	useSubscription(subscription.MEDICAL_SPECIALTY_UPSERTED, { onData: () => refetch() })

	return has('ReadMedicalSpecialty',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteMedicalSpecialty', <CreateMedicalSpecialty/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={medicalSpecialties}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Descripción' dataIndex='description' ellipsis/>
				<Column title='Sub-especialidades' ellipsis render={({ id, subspecialties }) => (
					<Tree treeData={subspecialties.map((sbsp: MedicalSubspecialty) => ({
						key: `${id}-${sbsp.id}`,
						title: sbsp.name
					}))}/>
				)}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					<Space>
						{
							has('WriteMedicalSpecialty', <>
								<UpdateMedicalSpecialty id={id}/>
								<DeleteMedicalSpecialty id={id}/>
							</>)
						}
						<InspectMedicalSpecialty id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
