
import { Button, Card, Checkbox, Divider, Form, Input, Select, Space } from 'antd'

import { CreateDialog, InspectDialog, UpdateDialog } from '../../../components'
import { Medication, DrugClass, DrugUnit, UpdateProps } from '../../../types'
import { useAntdHelp, useAuth } from '../../../hooks'

import { CreateDrugUnit } from '../../catalog/drug-unit/drug-unit-upsert.view'
import { CreateDrugClass } from '../../catalog/drug-class/drug-class-upsert.view'

import { mutation, query } from './medication.constant'


interface IMedicationCreateArgs {
	code:			string
	name:			string
	concentration:	string
	liname:			boolean

	classId:	number
	unidId:		number
}

interface IMedicationDependencies {
	clasess: Array<DrugClass>
	units: Array<DrugUnit>

	medication?: Medication
}

type MedicationFormProps = {
	mode: 'create' | 'update'
	data: IMedicationDependencies
	onSubmit: (data: IMedicationCreateArgs) => void
	onCancel: () => void
	onRefetch: () => void
}

function MedicationForm({ data, onSubmit, onCancel }: MedicationFormProps) {
	const { medication } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { touched, map, toLV } = useAntdHelp()
		, { has } = useAuth()
	const onFinish = () => onSubmit(touched(form))
	const format = (payload?: Medication) => {
		if (!payload) return undefined
		const { class: cls, unit, ...remaining } = payload
		return {
			...remaining,
			classId: cls.id,
			unitId: unit.id
		}
	}

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={format(medication)}>
			<Item
				name='code'
				label='Código de medicamento'
				rules={[{ required: true, message: 'Escriba el código del medicamento' }]}>
				<Input/>
			</Item>
			<Item
				name='name'
				label='Nombre de medicamento'
				rules={[{ required: true, message: 'Escriba el nombre del medicamento' }]}>
				<Input/>
			</Item>
			<Item
				name='concentration'
				label='Concentración'
				rules={[{ required: true, message: 'Escriba la concentración del medicamento' }]}>
				<Input/>
			</Item>
			<Item name='liname' valuePropName='checked'>
				<Checkbox defaultChecked={false}>LiNaMe</Checkbox>
			</Item>
			<Item
				name='unitId'
				label='Unidad medicamento'
				rules={[{ required: true, message: 'Seleccione la unidad del medicamento' }]}>
				<Select
					placeholder='Unidad medicamento'
					options={map(data.units, toLV)}
					dropdownRender={menu => (
						<>
							{menu}
							{
								has('WriteDrugUnit', <>
									<Divider style={{ margin: '8px 0' }}/>
									<CreateDrugUnit/>
								</>)
							}
						</>
					)}/>
			</Item>
			<Item
				name='classId'
				label='Clase medicamento'
				rules={[{ required: true, message: 'Seleccione clase del medicamento' }]}>
				<Select
					placeholder='Clase medicamento'
					options={map(data.clasess, toLV)}
					dropdownRender={menu => (
						<>
							{menu}
							{
								has('WriteDrugClass', <>
									<Divider style={{ margin: '8px 0' }}/>
									<CreateDrugClass/>
								</>)
							}
						</>
					)}/>
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

export function CreateMedication() {
	return (
		<CreateDialog<IMedicationCreateArgs, IMedicationDependencies>
			title='Nuevo medicamento'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_MEDICATION}
			render={(submit, close, data, refetch) => <MedicationForm mode='create' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function UpdateMedication({ id }: UpdateProps) {
	return (
		<UpdateDialog<IMedicationCreateArgs, IMedicationDependencies>
			id={id}
			title='Editar medicamento'
			query={query.UPDATE_DEPENDENCIES}
			mutation={mutation.UPDATE_MEDICATION}
			render={(submit, close, data, refetch) => <MedicationForm mode='update' data={data} onSubmit={submit} onCancel={close} onRefetch={refetch}/>}
		/>
	)
}

export function InspectMedication({ id }: UpdateProps) {
	return (
		<InspectDialog<{ medication: Medication }>
			id={id}
			title='Medicamento'
			render={({medication}) => <>
				<Card>
					<b>Nombre: </b><div>{medication.name}</div>
				</Card>
			</>}
			query={query.MEDICATION}
		/>
	)
}
