
import { useState } from 'react'
import { Input, Radio, Space, Table, Tag } from 'antd'

import { Separator, ToolBar, ToolBarMenu } from '../../../components'
import { Prescription, PrescriptionExtern, ClinicCareId } from '../../../types'
import { useAuth } from '../../../hooks'

import {
	CreatePrescription, UpdatePrescription, DeletePrescription,
	CreatePrescriptionExtern, UpdatePrescriptionExtern, DeletePrescriptionExtern, PrintPrescription
} from './prescription-upsert.view'
import { mutation } from './prescription.constant'

type PrescriptionProps = {
	prescriptions:			Array<Prescription>
	prescriptionExterns:	Array<PrescriptionExtern>
	edit:			boolean
} & ClinicCareId

export function PrescriptionManage({ clinicCareId, prescriptions, prescriptionExterns, edit }: PrescriptionProps) {
	const { has } = useAuth()
	const [ pharmacyOption, setPharmacyOption ] = useState('local')
	const { Column } = Table

	return (
		<>
			<ToolBar>
				<ToolBarMenu>
					<Input.Search enterButton allowClear />
					<Separator/>
					<Radio.Group
						block
						options={[
							{
								value: 'local',
								label: 'Propias'
							},
							{
								value: 'extern',
								label: 'Externas'
							}
						]}
						defaultValue="local"
						optionType="button"
						buttonStyle="solid"
						onChange={(e) => setPharmacyOption(e.target.value)}
					/>
				</ToolBarMenu>
				<ToolBarMenu>
					{
						pharmacyOption === 'local' &&
						<>
							<PrintPrescription clinicCareId={clinicCareId} gqlMutation={mutation.PRINT_PRESCRIPTION}/>
							{ edit && has('WriteClinicCare', <><Separator/><CreatePrescription clinicCareId={clinicCareId}/></>) }
						</>
					}
					{
						pharmacyOption === 'extern' &&
						<>
							<PrintPrescription clinicCareId={clinicCareId} gqlMutation={mutation.PRINT_PRESCRIPTION_EXTERN}/>
							{ edit && has('WriteClinicCare', <><Separator/><CreatePrescriptionExtern clinicCareId={clinicCareId}/></>) }
						</>
					}
				</ToolBarMenu>
			</ToolBar>
			{
				pharmacyOption === 'local' &&
				<Table
					size='middle'
					pagination={false}
					bordered={true}
					scroll={{ x: true }}
					dataSource={prescriptions.map(p => ({ ...p, key: `${p.pharmacy.id} ${p.id}`}))}
				>
					<Column title='Farmacia' ellipsis render={({ pharmacy }) => (
						<span>{ pharmacy ? pharmacy.name : 'Externa' }</span>
					)}/>
					<Column title='Código' render={({ medication }) => (
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
					<Column title='Con salida' ellipsis render={({ departured }) => (
						departured ? <Tag color='green'>Sí</Tag> : <Tag color='red'>No</Tag>
					)}/>
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
			}
			{
				pharmacyOption === 'extern' &&
				<Table
					size='middle'
					pagination={false}
					bordered={true}
					scroll={{ x: true }}
					dataSource={prescriptionExterns.map(p => ({ ...p, key: `${p.id}`}))}
				>
					<Column title='Código' render={({ medication }) => (
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
			}
		</>
	)
}
