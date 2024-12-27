
import { Button, Form, Input, Select, Space, DatePicker } from 'antd'

import { CreateDialog } from '../../../components'
import { Medication, Batch } from '../../../types'
import { useAntdHelp } from '../../../hooks'

import { mutation, query } from './batch.constant'

interface IBatchCreateArgs {
	code:		    string
	expireAt:	    Date
	medicationId:	boolean
}

interface IBatchDependencies {
	medications:	Array<Medication>
	batch?:			Batch
}

type BatchFormProps = {
	mode: 'create' | 'update'
	data: IBatchDependencies
	onSubmit: (data: IBatchCreateArgs) => void
	onCancel: () => void
}

function BatchForm({ data, onSubmit, onCancel }: BatchFormProps) {
	const { batch, medications } = data
		, { Item } = Form
		, [ form ] = Form.useForm()
		, { touched, map } = useAntdHelp()
	const onFinish = () => onSubmit(touched(form))
	const format = (payload?: Batch) => {
		if (!payload) return undefined
		const { medication, ...remaining } = payload
		return {
			...remaining,
			medicationId: medication.id
		}
	}

	return (
		<Form form={form} layout='vertical' autoComplete='off' onFinish={onFinish} initialValues={format(batch)}>
			<Item
				name='code'
				label='Código'
				rules={[{ required: true, message: 'Escriba el código del lote' }]}>
				<Input/>
			</Item>
			<Item name='medicationId' label='Medicamento' rules={[{ required: true, message: 'Seleccione medicamento' }]}>
				<Select
					options={map(medications, (medication: Medication) => {
						const { id, code, name, concentration, unit} = medication
						return {
							label: `${code} - ${name} - ${concentration} - ${unit.name}`,
							value: id
						}
					})}
					showSearch={true}
				/>
			</Item>
			<Item
				name='expireAt'
				label='Fecha de expiración'
				rules={[{ required: true, message: 'Seleccione fecha de expiración' }]}>
				<DatePicker format='DD/MM/YYYY'/>
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

export function CreateBatch() {
	return (
		<CreateDialog<IBatchCreateArgs, IBatchDependencies>
			title='Agregar lote'
			query={query.CREATE_DEPENDENCIES}
			mutation={mutation.CREATE_BATCH}
			render={(submit, close, data) => <BatchForm mode='create' data={{ ...data}} onSubmit={submit} onCancel={close}/>}
		/>
	)
}
