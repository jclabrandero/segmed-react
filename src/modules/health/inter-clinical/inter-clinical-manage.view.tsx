
import { Space, Table, Tree, Tag } from 'antd'

import { Interclinical, MedicalSpecialty, ClinicCareId } from '../../../types'
import { useAntdHelp, useDate } from '../../../hooks'

import {
	CreateInterclinical,
	UpdateInterclinical,
	DeleteInterclinical,
	ConfirmInterclinical, UploadFileInterclinical
} from './inter-clinical-upsert.view'
import { InfoCircleOutlined } from '@ant-design/icons'


type InterclinicalProps = {
	interclinicals:	Array<Interclinical>
	edit:			boolean
} & ClinicCareId

export function InterclinicalManage({ clinicCareId, interclinicals, edit }: InterclinicalProps) {
	const { format } = useDate()
		, { addKey } = useAntdHelp()
	const { Column } = Table

	return (
		<>
			{ !edit && <CreateInterclinical clinicCareId={clinicCareId}/> }

			<Table
				size='middle'
				pagination={false}
				bordered={true}
				dataSource={addKey(interclinicals)}
			>
				<Column title='Id' dataIndex='id'/>
				<Column title='Proveedor' render={({ provider }) => (
					<span>{ provider.businessName }</span>
				)}/>
				<Column title='Especialidades' render={({ id, medicalGroup }) => (
					<Tree defaultExpandAll treeData={[
						{
							title: medicalGroup.name,
							key: `${id}`,
							children: medicalGroup.specialties.map((specialty: MedicalSpecialty) => ({
								title: specialty.name,
								key: `${id}-${specialty.id}`,
								children: specialty.subspecialties.map(sbsp => ({
									title: sbsp.name,
									key: `${id}-${specialty.id}-${sbsp.id}`,
								}))
							}))
						}
					]} blockNode/>
				)}/>
				<Column title='Fecha solicitud' render={({ driftDate }) => (
					<span>{format(driftDate)}</span>
				)}/>
				<Column title='Observaciones' dataIndex='remark'/>
				<Column title='' render={({ approvedState }) => {
					const colors = ['#f50','#EBEB52','#52EB5B']
					return <Tag color={colors[approvedState]}><InfoCircleOutlined /></Tag>
				}}/>
				<Column title='Acciones' width='7rem' render={({ id, approvedState, files }: Interclinical) => {
					const stateOptions = [
						(<Space>
							<UpdateInterclinical id={id} clinicCareId={clinicCareId}/>
							<DeleteInterclinical id={id} clinicCareId={clinicCareId}/>
							<ConfirmInterclinical id={id} clinicCareId={clinicCareId} approvedState={1}/>
						</Space>),
						(<Space>
							<UploadFileInterclinical id={id} clinicCareId={clinicCareId}/>
							{ (files.length > 0) && <ConfirmInterclinical id={id} clinicCareId={clinicCareId} approvedState={2}/> }
						</Space>),
						(<Space>
							<UploadFileInterclinical id={id} clinicCareId={clinicCareId} disabled={true}/>
						</Space>)
					]
					return stateOptions[approvedState]
				}}/>
			</Table>
		</>
	)
}
