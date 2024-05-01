
import { Space, Table, Tree } from 'antd'
import { CheckCircleFilled, InfoCircleFilled, WarningFilled } from '@ant-design/icons'

import { ToolBar, ToolBarMenu } from '../../../components'
import { Interclinical, MedicalSpecialty, ClinicCareId } from '../../../types'
import { useAntdHelp, useDate } from '../../../hooks'

import {
	CreateInterclinical, UpdateInterclinical, DeleteInterclinical,
	ConfirmInterclinical, UploadFileInterclinical, PrintInterclinical
} from './inter-clinical-upsert.view'


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
			{
				edit && <ToolBar><ToolBarMenu>
					<CreateInterclinical clinicCareId={clinicCareId}/>
				</ToolBarMenu></ToolBar>
			}
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
					const fontSize = '22px'
					const stateIcon = [
						<WarningFilled style={{ color:'#f50', fontSize }}/>,
						<InfoCircleFilled style={{ color:'#EBD252', fontSize }}/>,
						<CheckCircleFilled style={{ color:'#52EB5B', fontSize }}/>
					]
					return stateIcon[approvedState]
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
							<PrintInterclinical id={id}/>
							{ (files.length > 0) && <ConfirmInterclinical id={id} clinicCareId={clinicCareId} approvedState={2}/> }
						</Space>),
						(<Space>
							<UploadFileInterclinical id={id} clinicCareId={clinicCareId} disabled={true}/>
							<PrintInterclinical id={id}/>
						</Space>)
					]
					return stateOptions[approvedState]
				}}/>
			</Table>
		</>
	)
}
