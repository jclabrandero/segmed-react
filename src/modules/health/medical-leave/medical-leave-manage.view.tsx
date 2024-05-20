
import { Space, Table } from 'antd'
import { CheckCircleFilled, InfoCircleFilled } from '@ant-design/icons'

import { ClinicCareId, MedicalLeave} from '../../../types'
import { useAntdHelp, useAuth, useDate } from '../../../hooks'
import { ToolBar, ToolBarMenu } from '../../../components'

import { ApproveMedicalLeave, CreateMedicalLeave, DeleteMedicalLeave, PrintMedicalLeave, UpdateMedicalLeave } from './medical-leave-upsert.view'


type MedicalLeaveProps = {
	medicalLeaves:	Array<MedicalLeave>
	edit:			boolean
} & ClinicCareId

export function MedicalLeaveManage({ clinicCareId, medicalLeaves, edit }: MedicalLeaveProps) {
	const { has } = useAuth()
	const { format } = useDate()
		, { addKey } = useAntdHelp()
	const { Column } = Table

	return (
		<>
			{
				edit && has('WriteClinicCare', <ToolBar><ToolBarMenu>
					<CreateMedicalLeave clinicCareId={clinicCareId}/>
				</ToolBarMenu></ToolBar>)
			}
			<Table
				size='middle'
				pagination={false}
				bordered={true}
				scroll={{ x: true }}
				dataSource={addKey(medicalLeaves)}
			>
				<Column title='' render={({ approvalState }) => {
					const fontSize = '20px'
					const stateIcon = [
						<InfoCircleFilled style={{ color:'#EBD252', fontSize }}/>,
						<CheckCircleFilled style={{ color:'#52EB5B', fontSize }}/>
					]
					return stateIcon[approvalState]
				}}/>
				<Column title='Id' dataIndex='id'/>
				<Column title='Motivo' dataIndex='reason'/>
				<Column title='Fecha de inicio' ellipsis render={({ startDate }) => (
					<span>{format(startDate, 'dd/MM/yyyy')}</span>
				)}/>
				<Column title='Fecha fin' ellipsis render={({ endDate }) => (
					<span>{format(endDate, 'dd/MM/yyyy')}</span>
				)}/>
				<Column title='Tipo de discapacidad' ellipsis render={({ disabilityType }) => (
					<span>{ disabilityType.name }</span>
				)}/>
				<Column title='Fecha aprobación' ellipsis render={({ approvalDate }) => (
					<span>{format(approvalDate)}</span>
				)}/>
				<Column title='Aprobado por' ellipsis render={({ approvalUser }) => (
					<span>{approvalUser?.displayName}</span>
				)}/>
				<Column title='Acciones' width='6rem' fixed='right' render={({ id, approvalState }: MedicalLeave) => {
					const stateOptions = [
						<Space>
							{
								has('WriteClinicCare', edit && <>
									<UpdateMedicalLeave id={id} clinicCareId={clinicCareId}/>
									<DeleteMedicalLeave id={id} clinicCareId={clinicCareId}/>
								</>)
							}
							{
								has('ApprovalMedicalLeave', <ApproveMedicalLeave id={id} clinicCareId={clinicCareId}/>)
							}
						</Space>,
						(<Space>
							<PrintMedicalLeave/>
						</Space>)
					]
					return stateOptions[approvalState]
				}}/>
			</Table>
		</>
	)
}
