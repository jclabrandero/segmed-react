
import { Button, Form, Input, Space } from 'antd'

import { CreateDialog, DeleteDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { DrugUnit, UpdateProps } from '../../../types'

import { mutation, query } from './drug-unit.constant'


interface IDrugUnitCreateArgs {
	nombre:			string
	descripcion?:	string
}

interface IDrugUnitDependencies {
	drugUnit?: DrugUnit
}

type DrugUnitFormProps = {
	mode: 'create' | 'update'
	data: IDrugUnitDependencies
	onSubmit: (data: IDrugUnitCreateArgs) => void
	onCancel: () => void
}

function DrugUnitForm({ data, onSubmit, onCancel }: DrugUnitFormProps) {
	const { drugUnit } = data
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const onFinish = () => onSubmit(touched(form))

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={drugUnit}>
			<Item
				name='name'
				label='Nombre'
				rules={[{ required: true, message: 'Escriba el nombre' }]}>
				<Input placeholder='Nombre'/>
			</Item>
			<Item
				name='description'
				label='Descripción'>
				<Input placeholder='Descripción'/>
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

export function CreateDrugUnit() {
	return (
		<CreateDialog<IDrugUnitCreateArgs, IDrugUnitDependencies>
			title='Nueva unidad medicamento'
			mutation={mutation.CREATE_DRUG_UNIT}
			render={(submit, close) => <DrugUnitForm mode='create' data={{}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdateDrugUnit({ id }: UpdateProps) {
	return (
		<UpdateDialog<IDrugUnitCreateArgs, IDrugUnitDependencies>
			id={id}
			title='Editar unidad medicamento'
			query={query.DRUG_UNIT}
			mutation={mutation.UPDATE_DRUG_UNIT}
			render={(submit, close, data) => <DrugUnitForm mode='update' data={data} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function DeleteDrugUnit({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ drugUnit: DrugUnit }>
			id={id}
			title='Eliminar unidad medicamento'
			render={({ drugUnit }) => `unidad medicamento: ${drugUnit.name}`}
			query={query.DRUG_UNIT}
			mutation={mutation.DELETE_DRUG_UNIT}
		/>
	)
}
