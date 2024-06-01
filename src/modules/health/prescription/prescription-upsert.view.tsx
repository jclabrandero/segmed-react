
import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Form, Input, InputNumber, Select, Space, Spin } from 'antd'
import { PrinterFilled } from '@ant-design/icons'

import { CreateDialog, DeleteDialog, ErrorDialog, Loader, ModalFileViewer, UpdateDialog } from '../../../components'
import { Pharmacy, MedicationStock, Medication, Prescription, PrescriptionExtern, ClinicCareId, UpdateProps, FileBase64 } from '../../../types'
import { useAntdHelp, useError } from '../../../hooks'

import { query, mutation} from './prescription.constant'


type TMedicationStock = { label: string, value: number } & MedicationStock

type PrescriptionMedicationFormFieldsProps = {
	mode: string
	medications: Array<TMedicationStock>
	onCancel: () => void
}

function PrescriptionMedicationFormFields({ mode, medications, onCancel }: PrescriptionMedicationFormFieldsProps) {
	const { Item } = Form
	const [ selectedMedication, setSelectedMedication ] = useState<TMedicationStock | null>(null)
	const filter = (inputValue: string, option: { label: string } | undefined) => option?.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1

	return (
		<>
			{
				mode == 'create' ?
					<Item name='medicationId' label='Medicamento' rules={[{ required: true, message: 'Seleccione medicamento' }]}>
						<Select
							options={medications}
							filterOption={filter}
							showSearch={true}
							onSelect={(_, option) => setSelectedMedication(option)}
						/>
					</Item>
					:
					<Item name='medication' label='Medicamento'>
						<Input disabled/>
					</Item>
			}
			<Item name='quantity' label='Cantidad' rules={[{ required: true, message: 'Escriba la cantidad' }]}>
				<InputNumber min={1} max={selectedMedication?.total}/>
			</Item>
			<Item name='indications' label='Indicaciones' rules={[{ required: true, message: 'Escriba las indicaciones' }]}>
				<Input/>
			</Item>
			<div className='modal-dialog-footer'>
				<Space>
					<Button type='default' onClick={onCancel}>Cancelar</Button>
					<Button type='primary' htmlType='submit'>Aceptar</Button>
				</Space>
			</div>
		</>
	)
}

function PrescriptionPharmacyMedication({ mode, pharmacyId, onCancel }: { mode: string, pharmacyId:	number, onCancel: () => void }) {
	const { map } = useAntdHelp()
		, [ error, onError ] = useError()
	const { loading, data } = useQuery(query.PHARMACY_STOCK, { onError, variables: { pharmacyId }, fetchPolicy: 'network-only' })
	const pharmacyStock = data ? data.pharmacyStock : []

	return loading ? <Spin/> : (
		<>
			<PrescriptionMedicationFormFields
				mode={mode}
				onCancel={onCancel}
				medications={map(
					pharmacyStock.filter((stock: MedicationStock) => stock.total > 0),
					(stock: MedicationStock) => {
						const { id, code, name, concentration, unit} = stock.medication
						return {
							...stock,
							label: `${code} - ${name} - ${concentration} - ${unit.name}`,
							value: id
						}
					}
				)}/>
			<ErrorDialog error={error}/>
		</>
	)
}

interface IPrescriptionCreateArgs {
	clinicCareId:	number

	pharmacyId:		number
	meticationId:	number
	quantity:		number
	indications:	string
}

interface IPrescriptionExternCreateArgs {
	clinicCareId:	number

	meticationId:	number
	quantity:		number
	indications:	string
}

interface IPrescriptionDependencies {
	pharmacies:		Array<Pharmacy>
	prescription?:	Prescription
}

type PrescriptionFormProps = {
	mode: string
	data: IPrescriptionDependencies & ClinicCareId
	onSubmit: (data: IPrescriptionCreateArgs) => void
	onCancel: () => void
}

function PrescriptionPharmacyForm({ mode, data, onSubmit, onCancel }: PrescriptionFormProps) {
	const pharmacy = data?.prescription?.pharmacy
	const { Item } = Form
		, [ form ] = Form.useForm()
		, { map, toLV, touched } = useAntdHelp()
		, [ pharmacyId, setPharmacyId ] = useState(pharmacy ? pharmacy.id: 0)
	const onFinish = () => onSubmit({ ...touched(form), clinicCareId: data.clinicCareId })
		, format = () => {
			if (!data.prescription) return undefined
			const { medication, pharmacy, ...remaining } = data.prescription
			return {
				pharmacy: pharmacy.name,
				medication: `${medication.code} - ${medication.name} - ${medication.concentration} - ${medication.unit.name}`,
				...remaining
			}
		}

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={format()}>
			{
				mode == 'create' ?
					<Item name='pharmacyId' label='Farmacia' style={{ width: '60%' }}>
						<Select
							options={map(data.pharmacies, toLV)}
							onChange={value => setPharmacyId(value)}/>
					</Item>
					:
					<Item name='pharmacy' label='Farmacia'>
						<Input disabled/>
					</Item>
			}
			{
				(pharmacyId != 0) &&
				<PrescriptionPharmacyMedication mode={mode} pharmacyId={pharmacyId} onCancel={onCancel}/>
			}
		</Form>
	)
}

export function CreatePrescription({ clinicCareId }: ClinicCareId) {
	return (
		<CreateDialog<IPrescriptionCreateArgs, IPrescriptionDependencies>
			title='Agregar receta médica'
			buttonText='Farmacias propias'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_PRESCRIPTION}
			render={(submit, close, data) => <PrescriptionPharmacyForm mode='create' data={{clinicCareId, ...data}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdatePrescription({ id, clinicCareId }: UpdateProps & ClinicCareId) {
	return (
		<UpdateDialog<IPrescriptionCreateArgs, IPrescriptionDependencies>
			id={id}
			title='Editar receta médica'
			query={query.UPDATE_DEPENDENCIES}
			mutation={mutation.UPDATE_PRESCRIPTION}
			render={(submit, close, data) => <PrescriptionPharmacyForm mode='update' data={{clinicCareId, ...data}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function DeletePrescription({ id, clinicCareId }: UpdateProps & ClinicCareId) {
	return (
		<DeleteDialog<{ prescription: Prescription }>
			id={id}
			title='Eliminar receta médica'
			render={({ prescription }) => `la receta: ${prescription.medication.name}`}
			query={query.PRESCRIPTION}
			mutation={mutation.DELETE_PRESCRIPTION}
			removeData={{ clinicCareId }}
		/>
	)
}

interface IPrescriptionExternDependencies {
	medications:			Array<Medication>
	prescriptionExtern?:	PrescriptionExtern
}

type PrescriptionExternFormProps = {
	mode: string
	data: IPrescriptionExternDependencies & ClinicCareId
	onSubmit: (data: IPrescriptionExternCreateArgs) => void
	onCancel: () => void
}

function PrescriptionExternForm({ mode, data, onSubmit, onCancel }: PrescriptionExternFormProps) {
	const [ form ] = Form.useForm()
		, { map, touched } = useAntdHelp()
	const onFinish = () => onSubmit({ ...touched(form), clinicCareId: data.clinicCareId })
		, format = () => {
			if (!data.prescriptionExtern) return undefined
			const { medication, ...remaining } = data.prescriptionExtern
			return {
				medication: `${medication.code} - ${medication.name} - ${medication.concentration} - ${medication.unit.name}`,
				...remaining
			}
		}

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={format()}>
			<PrescriptionMedicationFormFields mode={mode}
				medications={map(
					data.medications,
					(medication: Medication) => {
						const { id, code, name, concentration, unit} = medication
						return {
							label: `${code} - ${name} - ${concentration} - ${unit.name}`,
							value: id
						} as TMedicationStock
					})}
				onCancel={onCancel}/>
		</Form>
	)
}

export function CreatePrescriptionExtern({ clinicCareId }: ClinicCareId) {
	return (
		<CreateDialog<IPrescriptionExternCreateArgs, IPrescriptionExternDependencies>
			title='Agregar receta médica'
			buttonText='Farmacias externas'
			query={query.CREATE_EXTERN_DEPENDENCIES}
			mutation={mutation.CREATE_PRESCRIPTION_EXTERN}
			render={(submit, close, data) => <PrescriptionExternForm mode='create' data={{clinicCareId, ...data}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdatePrescriptionExtern({ id, clinicCareId }: UpdateProps & ClinicCareId) {
	return (
		<UpdateDialog<IPrescriptionExternCreateArgs, IPrescriptionExternDependencies>
			id={id}
			title='Editar receta médica'
			query={query.UPDATE_EXTERN_DEPENDENCIES}
			mutation={mutation.UPDATE_PRESCRIPTION_EXTERN}
			render={(submit, close, data) => <PrescriptionExternForm mode='update' data={{clinicCareId, ...data}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function DeletePrescriptionExtern({ id, clinicCareId }: UpdateProps & ClinicCareId) {
	return (
		<DeleteDialog<{ prescriptionExtern: PrescriptionExtern }>
			id={id}
			title='Eliminar receta médica'
			render={({ prescriptionExtern }) => `la receta: ${prescriptionExtern.medication.name}`}
			query={query.PRESCRIPTION_EXTERN}
			mutation={mutation.DELETE_PRESCRIPTION_EXTERN}
			removeData={{ clinicCareId }}
		/>
	)
}

export function PrintPrescription({ clinicCareId }: ClinicCareId) {
	const [ previewFile, setPreviewFile ] = useState<FileBase64 | null>(null)
	const onLoadFile = ({ file }: { file: FileBase64 }) => setPreviewFile(file)
		, [ print, { loading } ] = useMutation(mutation.PRINT_PRESCRIPTION, { onCompleted: onLoadFile })

	return (
		<>
			<Button
				shape='round'
				type='primary'
				icon={<PrinterFilled/>}
				onClick={() => print({ variables: { data: { clinicCareId } } })}/>

			<ModalFileViewer open={previewFile != null} file={previewFile} onCancel={() => setPreviewFile(null)}/>
			<Loader show={loading}/>
		</>
	)
}
