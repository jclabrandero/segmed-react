
import { Button, Form, Input, Space } from 'antd'

import { CreateDialog, DeleteDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { EmployeePosition, UpdateProps } from '../../../types'

import { mutation, query } from './employee-position.constant'


interface IEmployeePositionCreateArgs {
	nombre:			string
	descripcion?:	string
}

interface IEmployeePositionDependencies {
	employeePosition?: EmployeePosition
}

type EmployeePositionFormProps = {
	mode: 'create' | 'update'
	data: IEmployeePositionDependencies
	onSubmit: (data: IEmployeePositionCreateArgs) => void
	onCancel: () => void
}

function EmployeePositionForm({ data, onSubmit, onCancel }: EmployeePositionFormProps) {
	const { employeePosition } = data
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const onFinish = () => onSubmit(touched(form))
	const format = (payload?: EmployeePosition) => {
		if (!payload) return undefined
		const { ...remaining } = payload
		return { ...remaining }
	}

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={format(employeePosition)}>
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

export function CreateEmployeePosition() {
	return (
		<CreateDialog<IEmployeePositionCreateArgs, IEmployeePositionDependencies>
			title='Nuevo cargo de funcionario'
			mutation={mutation.CREATE_EMPLOYEE_POSITION}
			render={(submit, close) => <EmployeePositionForm mode='create' data={{}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdateEmployeePosition({ id }: UpdateProps) {
	return (
		<UpdateDialog<IEmployeePositionCreateArgs, IEmployeePositionDependencies>
			id={id}
			title='Editar cargo de funcionario'
			query={query.EMPLOYEE_POSITION}
			mutation={mutation.UPDATE_EMPLOYEE_POSITION}
			render={(submit, close, data) => <EmployeePositionForm mode='update' data={data} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function DeleteEmployeePosition({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ employeePosition: EmployeePosition }>
			id={id}
			title='Eliminar cargo de funcionario'
			render={({ employeePosition }) => `el cargo de funcionario: ${employeePosition.name}`}
			query={query.EMPLOYEE_POSITION}
			mutation={mutation.DELETE_EMPLOYEE_POSITION}
		/>
	)
}
