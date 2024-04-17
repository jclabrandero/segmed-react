
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table, Tag } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'

import { query, subscription } from './medical-specialty.constant'
import { CreateMedicalSpecialty, DeleteMedicalSpecialty, UpdateMedicalSpecialty } from './medical-specialty-upsert.view'


export function MedicalSpecialtyList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.MEDICAL_SPECIALTIES, { onError })
		, [ medicalSpecialties, filter ] = useFilter(addKey(data?.medicalSpecialties), ['name'])
	const { Column } = Table

	useSubscription(subscription.MEDICAL_SPECIALTY_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					<CreateMedicalSpecialty/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={medicalSpecialties}
				bordered={true}
				pagination={{ pageSize: 15 }}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name'/>
				<Column title='Descripción' dataIndex='description'/>
				<Column title='Sub-especialidades' render={({ subspecialties }) => subspecialties.map((sbsp: { id: number, name: string }) => (
					<Tag key={`${sbsp.id}-${sbsp.id}`}>{sbsp.name}</Tag>
				))}/>
				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' render={({ id }) => (
					<Space>
						<UpdateMedicalSpecialty id={id}/>
						<DeleteMedicalSpecialty id={id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
