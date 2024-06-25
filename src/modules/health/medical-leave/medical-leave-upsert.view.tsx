
import { Button, DatePicker, Form, Input, Select, Space } from 'antd'
import { CheckOutlined, PrinterFilled } from '@ant-design/icons'
import dayjs from 'dayjs'

import { CreateDialog, DeleteDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { ClinicCareId, DisabilityType, MedicalLeave, UpdateProps } from '../../../types'

import { mutation, query } from './medical-leave.constant'


interface IMedicalLeaveCreateArgs {
	clinicCareId:	number

	reason:				string
	startDate:			Date
	endDate:			Date
	disabilityTypeId:	number
}

interface IMedicalLeaveUpdateArgs {
	clinicCareId:	number

	reason?:			string
	startDate?:			Date
	endDate?:			Date
	disabilityTypeId?:	number
}

interface IMedicalLeaveDependencies {
	disabilityTypes:	Array<DisabilityType>
	medicalLeave?:		MedicalLeave
}

type MedicalLeaveFormProps = {
	data:		IMedicalLeaveDependencies & ClinicCareId
	onSubmit:	(data: IMedicalLeaveCreateArgs) => void
	onCancel:	() => void
}

function MedicalLeaveForm({ data: { clinicCareId, disabilityTypes, medicalLeave }, onSubmit, onCancel } : MedicalLeaveFormProps) {
	const { Item } = Form
		, [ form ] = Form.useForm()
		, { map, toLV, touched } = useAntdHelp()
		, disabilityTypeRef = medicalLeave ? disabilityTypes.find(({ name }) => name == medicalLeave.disabilityType.name) : null
	const onFinish = () => onSubmit({ ...touched(form), clinicCareId })
		, format = () => {
			if (!medicalLeave) return undefined
			const { disabilityType, startDate, endDate, ...remaining } = medicalLeave
			return { disabilityTypeId: disabilityTypeRef ? disabilityType.id : disabilityType.id * (-1), startDate: dayjs(startDate), endDate: dayjs(endDate), ...remaining }
		}
	return (
		<Form form={form} layout='vertical' onFinish={onFinish} initialValues={format()}>
			<Item
				label='Diagnóstico'
				name='reason'
				rules={[{ required: true, message: 'Escriba el diagnóstico' }]}>
				<Input.TextArea/>
			</Item>
			<Item
				name='startDate'
				label='Fecha de inicio'
				rules={[{ required: true, message: 'Seleccione fecha de inicio' }]}>
				<DatePicker format='DD/MM/YYYY'/>
			</Item>
			<Item
				name='endDate'
				label='Fecha fin'
				rules={[{ required: true, message: 'Seleccione fecha fin' }]}>
				<DatePicker format='DD/MM/YYYY'/>
			</Item>
			<Item
				name='disabilityTypeId'
				label='Tipo de discapacidad'
				rules={[{ required: true, message: 'Seleccione el tipo de discapacidad' }]}>
				<Select options={map((disabilityTypeRef || !medicalLeave) ? disabilityTypes : [ { id: medicalLeave.disabilityType.id * (-1), name: medicalLeave.disabilityType.name }, ...disabilityTypes ], toLV)}/>
			</Item>
			<div className='modal-dialog-footer'>
				<Space>
					<Button type='default' onClick={onCancel}>Cancelar</Button>
					<Button type='primary' htmlType='submit'>Aceptar</Button>
				</Space>
			</div>
		</Form>
	)
}

export function CreateMedicalLeave({ clinicCareId }: ClinicCareId) {
	return (
		<CreateDialog<IMedicalLeaveCreateArgs, IMedicalLeaveDependencies>
			title='Agregar baja médica'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_MEDICAL_LEAVE}
			render={(submit, close, data) => <MedicalLeaveForm data={{ clinicCareId, ...data }} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdateMedicalLeave({ id, clinicCareId }: UpdateProps & ClinicCareId) {
	return (
		<UpdateDialog<IMedicalLeaveUpdateArgs, IMedicalLeaveDependencies>
			id={id}
			title='Editar baja médica'
			query={query.UPDATE_DEPENDENCIES}
			mutation={mutation.UPDATE_MEDICAL_LEAVE}
			render={(submit, close, data) => <MedicalLeaveForm data={{clinicCareId, ...data}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function DeleteMedicalLeave({ id, clinicCareId }: UpdateProps & ClinicCareId) {
	return (
		<DeleteDialog<{ medicalLeave: MedicalLeave }>
			id={id}
			title='Eliminar baja médica'
			render={({ medicalLeave }) => `la baja médica: ${medicalLeave.id}`}
			query={query.MEDICAL_LEAVE}
			mutation={mutation.DELETE_MEDICAL_LEAVE}
			removeData={{ clinicCareId }}
		/>
	)
}

export function ApproveMedicalLeave({ id, clinicCareId }: UpdateProps & ClinicCareId) {
	return (
		<UpdateDialog<IMedicalLeaveUpdateArgs, { medicalLeave: MedicalLeave }>
			id={id}
			title='Aprobar baja médica'
			query={query.MEDICAL_LEAVE}
			mutation={mutation.APPROVE_MEDICAL_LEAVE}
			icon={<CheckOutlined/>}
			render={(submit, close) => (
				<Form layout='vertical' onFinish={() => submit({ clinicCareId })}>
					<p>Está seguro de aprobar la baja médica "{ id }"?</p>
					<div className='modal-dialog-footer'>
						<Space>
							<Button type='default' onClick={close}>Cancelar</Button>
							<Button type='primary' htmlType='submit'>Aprobar</Button>
						</Space>
					</div>
				</Form>
			)}
		/>
	)
}

export function PrintMedicalLeave() {

	return (
		<>
			<Button
				shape='circle'
				type='text'
				size='small'
				className='table-toolbtn'
				icon={<PrinterFilled/>}
				onClick={() => {}}/>

		</>
	)
}
