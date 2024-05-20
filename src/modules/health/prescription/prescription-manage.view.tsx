
import { Button, Dropdown, Space, Table } from 'antd'

import { ToolBar, ToolBarMenu } from '../../../components'
import { Prescription, PrescriptionExtern, ClinicCareId } from '../../../types'
import { useAuth } from '../../../hooks'

import {
	CreatePrescription, UpdatePrescription, DeletePrescription,
	CreatePrescriptionExtern, UpdatePrescriptionExtern, DeletePrescriptionExtern, PrintPrescription
} from './prescription-upsert.view'


type PrescriptionProps = {
	prescriptions:			Array<Prescription>
	prescriptionExterns:	Array<PrescriptionExtern>
	edit:			boolean
} & ClinicCareId

export function PrescriptionManage({ clinicCareId, prescriptions, prescriptionExterns, edit }: PrescriptionProps) {
	const { has } = useAuth()
	const { Column } = Table
	const dataset = [
		...prescriptions.map(p => ({ ...p, key: `${p.pharmacy.id} ${p.id}`})), 
		...prescriptionExterns.map(p => ({ ...p, key: `${p.id}`}))
	]

	return (
		<>
			{
				edit && <ToolBar><ToolBarMenu>
					{ has('WriteClinicCare', <Dropdown menu={{
						items: [
							{
								key: 'pharmacy',
								label: <CreatePrescription clinicCareId={clinicCareId}/>
							},
							{
								key: 'extern',
								label: <CreatePrescriptionExtern clinicCareId={clinicCareId}/>
							}
						]
					}}>
						<Button type='primary' shape='round'>Agregar medicamento</Button>
					</Dropdown>) }
				</ToolBarMenu>
				<ToolBarMenu>
					<PrintPrescription clinicCareId={clinicCareId}/>
				</ToolBarMenu>
				</ToolBar>
			}
			<Table
				size='middle'
				pagination={false}
				bordered={true}
				scroll={{ x: true }}
				dataSource={dataset}
			>
				<Column title='Farmacia' ellipsis render={({ pharmacy }) => (
					<span>{ pharmacy ? pharmacy.name : 'Externa' }</span>
				)}/>
				<Column title='Codigo' render={({ medication }) => (
					<span>{ medication.code }</span>
				)}/>
				<Column title='Nombre' ellipsis render={({ medication }) => (
					<span>{ medication.name }</span>
				)}/>
				<Column title='Concentración' ellipsis render={({ medication }) => (
					<span>{ medication.concentration }</span>
				)}/>
				<Column title='Unidad' ellipsis render={({ medication }) => (
					<span>{ medication.unit.name }</span>
				)}/>
				<Column title='Cantidad' dataIndex='quantity'/>
				<Column title='Indicaciones' dataIndex='indications'/>
				{
					edit ? has('WriteClinicCare', <Column title='Acciones' width='6rem' fixed='right' render={({ id, pharmacy }: Prescription) =>
						pharmacy
							? <Space>
								<UpdatePrescription id={id} clinicCareId={clinicCareId}/>
								<DeletePrescription id={id} clinicCareId={clinicCareId}/>
							</Space>
							: <Space>
								<UpdatePrescriptionExtern id={id} clinicCareId={clinicCareId}/>
								<DeletePrescriptionExtern id={id} clinicCareId={clinicCareId}/>
							</Space>
					}/>) : null
				}
			</Table>
		</>
	)
}
