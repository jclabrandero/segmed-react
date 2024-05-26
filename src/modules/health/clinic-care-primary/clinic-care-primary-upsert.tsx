

import { Button, Form, Input, Space } from 'antd'

import { CreateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { ClinicCarePrimary, ClinicCareId, UpdateProps } from '../../../types'

import { query, mutation } from './clinic-care-primary.constant'


interface IClinicCarePrimaryUpsertArgs {
	clinicCareId:	number

	reason?:		string
	physicalExam?:	string
	diagnosis?:		string
}

interface IClinicCarePrimaryDependencies {
	primary:	ClinicCarePrimary
}

type ClinicCarePrimaryFormProps = {
	data:		IClinicCarePrimaryDependencies & ClinicCareId
	onSubmit:	(data: IClinicCarePrimaryUpsertArgs) => void
	onCancel:	() => void
}

function ClinicCarePrimaryForm({ data: { primary, clinicCareId }, onSubmit, onCancel } : ClinicCarePrimaryFormProps) {
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched } = useAntdHelp()
	const onFinish = () => onSubmit({ ...touched(form), clinicCareId })

	return (
		<Form form={form} layout='vertical' onFinish={onFinish} initialValues={{ ...primary }}>
			<Item label='Motivo, descripción de la sintomatología' name='reason'>
				<Input.TextArea autoSize/>
			</Item>
			<Item label='Examen físico' name='physicalExam'>
				<Input.TextArea autoSize/>
			</Item>
			<Item label='Diagnóstico' name='diagnosis'>
				<Input.TextArea autoSize/>
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

export function UpsertClinicCarePrimary({ id, clinicCareId }: UpdateProps & ClinicCareId) {
	return (
		<CreateDialog<IClinicCarePrimaryUpsertArgs, IClinicCarePrimaryDependencies>
			options={{ variables: { id } }}
			title='Editar detalles de consulta'
			query={query.CLINIC_CARE_PRIMARY}
			mutation={mutation.UPSERT_CLINIC_CARE_PRIMARY}
			render={(submit, close, data) => <ClinicCarePrimaryForm data={{ clinicCareId, ...data }} onSubmit={submit} onCancel={close}/>}
		/>
	)
}
