
import { useQuery, useSubscription } from '@apollo/client'
import { Input, Space, Table } from 'antd'

import { ErrorDialog, Loader, ToolBar, ToolBarMenu } from '../../../components'
import { useError, useAntdHelp, useFilter } from '../../../hooks'

import { query, subscription } from './medical-subspecialty.constant'
import { CreateMedicalSubspecialty, DeleteMedicalSubspecialty, UpdateMedicalSubspecialty } from './medical-subspecialty-upsert.view'


export function MedicalSubspecialtyList() {
	const { addKey, tableStatus } = useAntdHelp()
		, [ error, onError ] = useError()
		, { loading, data, refetch } = useQuery(query.MEDICAL_SUBSPECIALTIES, { onError })
		, [ medicalSubspecialties, filter ] = useFilter(addKey(data?.medicalSubspecialties), ['name'])
	const { Column } = Table

	useSubscription(subscription.MEDICAL_SUBSPECIALTY_UPSERTED, { onData: () => refetch() })

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear onSearch={filter}/>
				</ToolBarMenu>
				<ToolBarMenu>
					<CreateMedicalSubspecialty/>
				</ToolBarMenu>
			</ToolBar>

			<Table
				size='middle'
				dataSource={medicalSubspecialties}
				bordered={true}
				pagination={{ pageSize: 15 }}>
				<Column title='Id' dataIndex='id'/>
				<Column title='Nombre' dataIndex='name'/>
				<Column title='Descripción' dataIndex='description'/>
				<Column title='Rango de edad de los pacientes' dataIndex='ageRangePatients'/>

				<Column title='Diagnóstico o Terapéutico' dataIndex='dt'/>
				<Column title='Quirúrgico o Medicina interna' dataIndex='si'/>
				<Column title='Basado en órganos o Basado en la técnica' dataIndex='ot'/>

				<Column title='Estado' render={tableStatus}/>
				<Column title='Acciones' width='6rem' render={({ id }) => (
					<Space>
						<UpdateMedicalSubspecialty id={id}/>
						<DeleteMedicalSubspecialty id={id}/>
					</Space>
				)}/>
			</Table>

			<Loader show={loading}/>
			<ErrorDialog error={error}/>
		</>
	)
}
