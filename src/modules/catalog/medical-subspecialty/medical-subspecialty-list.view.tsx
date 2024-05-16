
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter, useAuth } from '../../../hooks'
import { NotAllowed } from '../../basic'

import { query, subscription } from './medical-subspecialty.constant'
import { CreateMedicalSubspecialty, DeleteMedicalSubspecialty, InspectMedicalSubspecialty, UpdateMedicalSubspecialty } from './medical-subspecialty-upsert.view'


export function MedicalSubspecialtyList() {
	const { addKey, tableStatus } = useAntdHelp()
		, { has } = useAuth()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.MEDICAL_SUBSPECIALTIES, { onError })
		, [ medicalSubspecialties, filter ] = useFilter(addKey(data?.medicalSubspecialties), ['name', 'description'])
	const { Column } = Table

	useSubscription(subscription.MEDICAL_SUBSPECIALTY_UPSERTED, { onData: () => refetch() })

	return has('ReadMedicalSubspecialty',
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					{ has('WriteMedicalSubspecialty', <CreateMedicalSubspecialty/>) }
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={medicalSubspecialties}
				bordered={true}
				pagination={{ pageSize: 15 }}
				scroll={{ x: true }}
				loading={loading}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name' ellipsis/>
				<Column title='Descripción' dataIndex='description' ellipsis/>
				<Column title='Rango de edad de los pacientes' dataIndex='ageRangePatients' ellipsis/>

				<Column title='Diagnóstico o Terapéutico' dataIndex='dt' ellipsis/>
				<Column title='Quirúrgico o Medicina interna' dataIndex='si' ellipsis/>
				<Column title='Basado en órganos o Basado en la técnica' dataIndex='ot' ellipsis/>

				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id }) => (
					<Space>
						{
							has('WriteMedicalSubspecialty',<>
								<UpdateMedicalSubspecialty id={id}/>
								<DeleteMedicalSubspecialty id={id}/>
							</>)
						}
						<InspectMedicalSubspecialty id={id}/>
					</Space>
				)}/>
			</Table>

			<ErrorDialog error={error}/>
		</>,
		<NotAllowed/>
	)
}
