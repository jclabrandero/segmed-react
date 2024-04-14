
import { Button, Form, Input, Space } from 'antd'

import { CreateDialog, DeleteDialog, UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { Belonging, UpdateProps } from '../../../types'

import { mutation, query } from './belonging.constant'


interface IBelongingCreateArgs {
	name:	string
}

interface IBelongingDependencies {
	belonging?: Belonging
}

type BelongingFormProps = {
	mode: 'create' | 'update'
	data: IBelongingDependencies
	onSubmit: (data: IBelongingCreateArgs) => void
	onCancel: () => void
}

function BelongingForm({ data, onSubmit, onCancel }: BelongingFormProps) {
	const { belonging } = data
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const onFinish = () => onSubmit(touched(form))
	const format = (payload?: Belonging) => {
		if (!payload) return undefined
		const { ...remaining } = payload
		return { ...remaining }
	}

	return (
		<Form layout='vertical' autoComplete='off' onFinish={onFinish} form={form} initialValues={format(belonging)}>
			<Item
				name='name'
				label='Nombre'
				rules={[{ required: true, message: 'Escriba el nombre' }]}>
				<Input placeholder='Nombre'/>
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

export function CreateBelonging() {
	return (
		<CreateDialog<IBelongingCreateArgs, IBelongingDependencies>
			title='Nueva pertinencia'
			mutation={mutation.CREATE_BELONGING}
			render={(submit, close) => <BelongingForm mode='create' data={{}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function UpdateBelonging({ id }: UpdateProps) {
	return (
		<UpdateDialog<IBelongingCreateArgs, IBelongingDependencies>
			id={id}
			title='Editar pertinencia'
			query={query.BELONGING}
			mutation={mutation.UPDATE_BELONGING}
			render={(submit, close, data) => <BelongingForm mode='update' data={data} onSubmit={submit} onCancel={close}/>}
		/>
	)
}

export function DeleteBelonging({ id }: UpdateProps) {
	return (
		<DeleteDialog<{ belonging: Belonging }>
			id={id}
			title='Eliminar pertinencia'
			render={({ belonging }) => `pertinencia: ${belonging.name}`}
			query={query.BELONGING}
			mutation={mutation.DELETE_BELONGING}
		/>
	)
}
