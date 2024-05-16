
import { Button, Card, Form, Input, Space } from 'antd'

import { CreateDialog, DeleteDialog, InspectDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { DrugClass, UpdateProps } from '../../../types'

import { mutation, query } from './drug-class.constant'


interface IDrugClassCreateArgs {
	nombre:			string
	descripcion?:	string
}

interface IDrugClassDependencies {
	drugClass?: DrugClass
}

type DrugClassFormProps = {
	mode: 'create' | 'update'
	data: IDrugClassDependencies
	onSubmit: (data: IDrugClassCreateArgs) => void
	onCancel: () => void
}

function DrugClassForm({ data, onSubmit, onCancel }: DrugClassFormProps) {
	const { drugClass } = data
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const onFinish = () => onSubmit(touched(form))

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={drugClass}>
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

export function CreateDrugClass() {
	return (
		<CreateDialog<IDrugClassCreateArgs, IDrugClassDependencies>
			title='Nueva clase medicamento'
			mutation={mutation.CREATE_DRUG_CLASS}
			render={(submit, close) => <DrugClassForm mode='create' data={{}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdateDrugClass({ id }: UpdateProps) {
	return (
		<UpdateDialog<IDrugClassCreateArgs, IDrugClassDependencies>
			id={id}
			title='Editar clase medicamento'
			query={query.DRUG_CLASS}
			mutation={mutation.UPDATE_DRUG_CLASS}
			render={(submit, close, data) => <DrugClassForm mode='update' data={data} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function DeleteDrugClass({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ drugClass: DrugClass }>
			id={id}
			title='Eliminar clase medicamento'
			render={({ drugClass }) => `clase medicamento: ${drugClass.name}`}
			query={query.DRUG_CLASS}
			mutation={mutation.DELETE_DRUG_CLASS}
		/>
	)
}

export function InspectDrugClass({ id }: UpdateProps) {
	return (
		<InspectDialog<{ drugClass: DrugClass }>
			id={id}
			title='Clase medicamento'
			render={({drugClass}) => <>
				<Card>
					<b>Nombre: </b><div>{drugClass.name}</div>
				</Card>
			</>}
			query={query.DRUG_CLASS}
		/>
	)
}
