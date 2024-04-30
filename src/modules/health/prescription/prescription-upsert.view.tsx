
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { Button, Form, Input, InputNumber, Select, Space, Spin } from 'antd'

import { CreateDialog, DeleteDialog, UpdateDialog } from '../../../components'
import { Pharmacy, MedicationStock, Medication, Prescription, PrescriptionExtern, ClinicCareId, UpdateProps } from '../../../types'
import { useAntdHelp } from '../../../hooks'

import { query, mutation} from './prescription.constant'


type TMedicationStock = { label: string, value: number } & MedicationStock

type PrescriptionMedicationFormFieldsProps = {
	medications: Array<TMedicationStock>
	onCancel: () => void
}

function PrescriptionMedicationFormFields({ medications, onCancel }: PrescriptionMedicationFormFieldsProps) {
	const { Item } = Form
	const [ selectedMedication, setSelectedMedication ] = useState<TMedicationStock | null>(null)

	return (
		<>
			<Item name='medicationId' label='Medicamento' rules={[{ required: true, message: 'Seleccione medicamento' }]}>
				<Select
					options={medications}
					onSelect={(_, option) => setSelectedMedication(option)}
				/>
			</Item>
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

function PrescriptionPharmacyMedication({ pharmacyId, onCancel }: { pharmacyId:	number, onCancel: () => void }) {
	const { map } = useAntdHelp()
	const { loading, data } = useQuery(query.PHARMACY_STOCK, { variables: { pharmacyId }, fetchPolicy: 'network-only' })

	return loading ? <Spin/> : (
		<PrescriptionMedicationFormFields
			onCancel={onCancel}
			medications={map(
				data.pharmacyStock.filter((stock: MedicationStock) => stock.total > 0),
				(stock: MedicationStock) => {
					const { id, code, name, concentration, unit} = stock.medication
					return {
						...stock,
						label: `${code} - ${name} - ${concentration} - ${unit.name}`,
						value: id
					}
				}
			)}/>
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
	data: IPrescriptionDependencies & ClinicCareId
	onSubmit: (data: IPrescriptionCreateArgs) => void
	onCancel: () => void
}

function PrescriptionPharmacyForm({ data, onSubmit, onCancel }: PrescriptionFormProps) {
	const pharmacy = data?.prescription?.pharmacy
	const { Item } = Form
		, [ form ] = Form.useForm()
		, { map, toLV, touched } = useAntdHelp()
		, [ pharmacyId, setPharmacyId ] = useState(pharmacy ? pharmacy.id: 0)
	const onFinish = () => onSubmit({ ...touched(form), clinicCareId: data.clinicCareId })
		, format = () => {
			if (!data.prescription) return undefined
			const { medication, pharmacy, ...remaining } = data.prescription
			return { medicationId: medication.id, pharmacyId: pharmacy.id, ...remaining }
		}

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={format()}>
			<Item name='pharmacyId' label='Farmacia' style={{ width: '60%' }}>
				<Select
					disabled={Boolean(pharmacy)}
					options={map(data.pharmacies, toLV)}
					onChange={value => setPharmacyId(value)}/>
			</Item>
			{
				(pharmacyId != 0) &&
				<PrescriptionPharmacyMedication pharmacyId={pharmacyId} onCancel={onCancel}/>
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
			render={(submit, close, data) => <PrescriptionPharmacyForm data={{clinicCareId, ...data}} onSubmit={submit} onCancel={close}/>}
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
			render={(submit, close, data) => <PrescriptionPharmacyForm data={{clinicCareId, ...data}} onSubmit={submit} onCancel={close}/>}
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
	data: IPrescriptionExternDependencies & ClinicCareId
	onSubmit: (data: IPrescriptionExternCreateArgs) => void
	onCancel: () => void
}

function PrescriptionExternForm({ data, onSubmit, onCancel }: PrescriptionExternFormProps) {
	const [ form ] = Form.useForm()
		, { map, touched } = useAntdHelp()
	const onFinish = () => onSubmit({ ...touched(form), clinicCareId: data.clinicCareId })
		, format = () => {
			if (!data.prescriptionExtern) return undefined
			const { medication, ...remaining } = data.prescriptionExtern
			return { medicationId: medication.id, ...remaining }
		}

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={format()}>
			<PrescriptionMedicationFormFields
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
			render={(submit, close, data) => <PrescriptionExternForm data={{clinicCareId, ...data}} onSubmit={submit} onCancel={close}/>}
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
			render={(submit, close, data) => <PrescriptionExternForm data={{clinicCareId, ...data}} onSubmit={submit} onCancel={close}/>}
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
