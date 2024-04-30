
import { Button, Form, Select, Space, Tag } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

import { UpdateDialog } from '../../../components'
import { useAntdHelp } from '../../../hooks'
import { ClinicalCareState, UpdateProps } from '../../../types'

import { query, mutation } from './clinic-care.constant'


interface IClinicCareStateDependencies {
	state:	ClinicalCareState
	states:	Array<ClinicalCareState>
}

type ClinicCareStateFormProps = {
	data:	IClinicCareStateDependencies
	filterStates:	boolean
	onSubmit:	(data: { stateId: number }) => void
	onCancel:	() => void
}

function ClinicCareStateForm({ data: { state, states }, filterStates, onSubmit, onCancel } : ClinicCareStateFormProps) {
	const { Item } = Form
	const [ form ] = Form.useForm()
	const { touched, map, toLV } = useAntdHelp()
	const onFinish = () => onSubmit(touched(form))

	return (
		<Form form={form} layout='vertical' onFinish={onFinish} initialValues={{ stateId: state.id }}>
			<Item
				name='stateId'
				label='Estado de la consulta'
				rules={[{ required: true, message: 'Seleccione estado de la consulta' }]}>
				<Select options={map(filterStates ? states.filter(s => !s.lock) : states, toLV)}/>
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

function UpsertClinicCareState({ id, filterStates }: UpdateProps & { filterStates: boolean}) {
	return (
		<UpdateDialog<{ stateId: number }, IClinicCareStateDependencies>
			id={id}
			icon={<CheckCircleOutlined/>}
			title='Editar estado de consulta'
			query={query.CLINIC_CARE_STATE_DEPENDENCIES}
			mutation={mutation.UPDATE_CLINIC_CARE_STATE}
			render={(submit, close, data) => <ClinicCareStateForm data={data} onSubmit={submit} onCancel={close} filterStates={filterStates}/>}
		/>
	)
}

type ClinicCareStateProps = {
	clinicCareId:	number
	state:			ClinicalCareState
	edit:			boolean
	filterStates:	boolean
}

export function ClinicCareState({ clinicCareId, state, edit, filterStates }: ClinicCareStateProps) {
	return (
		<>
			<Tag color={state.color}>{state.name}</Tag>
			{ edit && <UpsertClinicCareState id={clinicCareId} filterStates={filterStates}/> }
		</>
	)
}
