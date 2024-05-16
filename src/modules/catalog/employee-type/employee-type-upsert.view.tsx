
import { Button, Card, Form, Input, Space } from 'antd'

import { CreateDialog, DeleteDialog, InspectDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { EmployeeType, UpdateProps } from '../../../types'

import { mutation, query } from './employee-type.constant'


interface IEmployeeTypeCreateArgs {
	nombre:			string
	descripcion?:	string
}

interface IEmployeeTypeDependencies {
	employeeType?: EmployeeType
}

type EmployeeTypeFormProps = {
	mode: 'create' | 'update'
	data: IEmployeeTypeDependencies
	onSubmit: (data: IEmployeeTypeCreateArgs) => void
	onCancel: () => void
}

function EmployeeTypeForm({ data, onSubmit, onCancel }: EmployeeTypeFormProps) {
	const { employeeType } = data
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const onFinish = () => onSubmit(touched(form))
	const format = (payload?: EmployeeType) => {
		if (!payload) return undefined
		const { ...remaining } = payload
		return { ...remaining }
	}

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={format(employeeType)}>
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

export function CreateEmployeeType() {
	return (
		<CreateDialog<IEmployeeTypeCreateArgs, IEmployeeTypeDependencies>
			title='Nuevo tipo de funcionario'
			mutation={mutation.CREATE_EMPLOYEE_TYPE}
			render={(submit, close) => <EmployeeTypeForm mode='create' data={{}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdateEmployeeType({ id }: UpdateProps) {
	return (
		<UpdateDialog<IEmployeeTypeCreateArgs, IEmployeeTypeDependencies>
			id={id}
			title='Editar tipo de funcionario'
			query={query.EMPLOYEE_TYPE}
			mutation={mutation.UPDATE_EMPLOYEE_TYPE}
			render={(submit, close, data) => <EmployeeTypeForm mode='update' data={data} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function DeleteEmployeeType({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ employeeType: EmployeeType }>
			id={id}
			title='Eliminar tipo de funcionario'
			render={({ employeeType }) => `el tipo de funcionario: ${employeeType.name}`}
			query={query.EMPLOYEE_TYPE}
			mutation={mutation.DELETE_EMPLOYEE_TYPE}
		/>
	)
}

export function InspectEmployeeType({ id }: UpdateProps) {
	return (
		<InspectDialog<{ employeeType: EmployeeType }>
			id={id}
			title='Sub-especialidad médica'
			render={({employeeType}) => <>
				<Card>
					<b>Nombre: </b><div>{employeeType.name}</div>
				</Card>
			</>}
			query={query.EMPLOYEE_TYPE}
		/>
	)
}
