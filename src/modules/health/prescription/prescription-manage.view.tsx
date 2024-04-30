
import { Button, Dropdown, Space, Table } from 'antd'

import { Prescription, PrescriptionExtern, ClinicCareId } from '../../../types'
import {
	CreatePrescription, UpdatePrescription, DeletePrescription,
	CreatePrescriptionExtern, UpdatePrescriptionExtern, DeletePrescriptionExtern
} from './prescription-upsert.view'


type PrescriptionProps = {
	prescriptions:			Array<Prescription>
	prescriptionExterns:	Array<PrescriptionExtern>
	edit:			boolean
} & ClinicCareId

export function PrescriptionManage({ clinicCareId, prescriptions, prescriptionExterns, edit }: PrescriptionProps) {
	const { Column } = Table
	const dataset = [
		...prescriptions.map(p => ({ ...p, key: `${p.pharmacy.id} ${p.id}`})), 
		...prescriptionExterns.map(p => ({ ...p, key: `${p.id}`}))
	]

	return (
		<>
			{ !edit && <Dropdown menu={{
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
			}}><Button type='primary' shape='round'>Agregar medicamento</Button></Dropdown>  }
			<br/>
			<Table
				size='middle'
				pagination={false}
				bordered={true}
				dataSource={dataset}
			>
				<Column title='Farmacia' render={({ pharmacy }) => (
					<span>{ pharmacy ? pharmacy.name : 'Externa' }</span>
				)}/>
				<Column title='Codigo' render={({ medication }) => (
					<span>{ medication.code }</span>
				)}/>
				<Column title='Nombre' render={({ medication }) => (
					<span>{ medication.name }</span>
				)}/>
				<Column title='Concentración' className='table-cell-nowrap' render={({ medication }) => (
					<span>{ medication.concentration }</span>
				)}/>
				<Column title='Unidad' className='table-cell-nowrap' render={({ medication }) => (
					<span>{ medication.unit.name }</span>
				)}/>
				<Column title='Cantidad' dataIndex='quantity'/>
				<Column title='Indicaciones' dataIndex='indications'/>
				{
					edit ? <Column title='Acciones' width='7rem' render={({ id, pharmacy }: Prescription) =>
						pharmacy
							? <Space>
								<UpdatePrescription id={id} clinicCareId={clinicCareId}/>
								<DeletePrescription id={id} clinicCareId={clinicCareId}/>
							</Space>
							: <Space>
								<UpdatePrescriptionExtern id={id} clinicCareId={clinicCareId}/>
								<DeletePrescriptionExtern id={id} clinicCareId={clinicCareId}/>
							</Space>
					}/> : null
				}
			</Table>
		</>
	)
}
